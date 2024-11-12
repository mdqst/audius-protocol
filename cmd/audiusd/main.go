package main

import (
	"context"
	"encoding/hex"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"log"

	"github.com/AudiusProject/audius-protocol/pkg/core"
	"github.com/AudiusProject/audius-protocol/pkg/core/common"
	"github.com/AudiusProject/audius-protocol/pkg/uptime"

	"github.com/AudiusProject/audius-protocol/pkg/mediorum"

	"github.com/ethereum/go-ethereum/crypto"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	tlsEnabled := getEnvBool("ENABLE_TLS", false)
	storageEnabled := getEnvBool("ENABLE_STORAGE", false)

	logger := common.NewLogger(nil)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	hostUrl, err := url.Parse(os.Getenv("creatorNodeEndpoint"))
	if err != nil {
		log.Fatalf("Could not parse endpoint url: %v", err)
	}

	// make it work out of the box with no config
	delegatePrivateKey := os.Getenv("delegatePrivateKey")
	if delegatePrivateKey == "" {
		delegatePrivateKey, delegateOwnerWallet := keyGen()
		os.Setenv("delegatePrivateKey", delegatePrivateKey)
		os.Setenv("delegateOwnerWallet", delegateOwnerWallet)
		logger.Infof("Generated and set delegate key pair: %s", delegateOwnerWallet)
	}

	go func() {
		if err := startEchoProxyWithOptionalTLS(hostUrl, tlsEnabled); err != nil {
			log.Fatalf("Echo server failed: %v", err)
			cancel()
		}
	}()

	go func() {
		if err := uptime.Run(ctx, logger); err != nil {
			logger.Errorf("fatal uptime error: %v", err)
			cancel()
		}
	}()

	go func() {
		if err := core.Run(ctx, logger); err != nil {
			logger.Errorf("fatal core error: %v", err)
			cancel()
		}
	}()

	if storageEnabled {
		go func() {
			if err := mediorum.Run(ctx, logger); err != nil {
				logger.Errorf("fatal mediorum error: %v", err)
				cancel()
			}
		}()
	}

	<-sigChan
	logger.Info("Received termination signal, shutting down...")

	cancel()

	<-ctx.Done() // run forever, no crashloops
	logger.Info("Shutdown complete")
}

func startEchoProxyWithOptionalTLS(hostUrl *url.URL, enableTLS bool) error {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	urlCore, err := url.Parse("http://localhost:26659")
	if err != nil {
		e.Logger.Fatal(err)
	}
	urlMediorum, err := url.Parse("http://localhost:1991")
	if err != nil {
		e.Logger.Fatal(err)
	}
	urlDAPI, err := url.Parse("http://localhost:1996")
	if err != nil {
		e.Logger.Fatal(err)
	}

	coreProxy := httputil.NewSingleHostReverseProxy(urlCore)
	mediorumProxy := httputil.NewSingleHostReverseProxy(urlMediorum)
	dAPIProxy := httputil.NewSingleHostReverseProxy(urlDAPI)

	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	e.Any("/console/*", echo.WrapHandler(coreProxy))
	e.Any("/core/*", echo.WrapHandler(coreProxy))
	e.Any("/d_api/*", echo.WrapHandler(dAPIProxy))

	e.Any("/*", echo.WrapHandler(mediorumProxy))

	if enableTLS {
		e.AutoTLSManager.HostPolicy = autocert.HostWhitelist(hostUrl.Hostname())
		e.AutoTLSManager.Cache = autocert.DirCache("/data/var/www/.cache")
		e.Pre(middleware.HTTPSRedirect())

		go func() {
			if err := e.StartAutoTLS(":443"); err != nil && err != http.ErrServerClosed {
				e.Logger.Fatal("shutting down the server")
			}
		}()

		go func() {
			if err := e.Start(":80"); err != nil && err != http.ErrServerClosed {
				e.Logger.Fatal("HTTP server failed")
			}
		}()

		return nil
	}

	return e.Start(":80")
}

func keyGen() (pKey string, addr string) {
	privateKey, err := crypto.GenerateKey()
	if err != nil {
		log.Fatalf("Failed to generate private key: %v", err)
	}
	privateKeyBytes := crypto.FromECDSA(privateKey)
	privateKeyStr := hex.EncodeToString(privateKeyBytes)
	address := crypto.PubkeyToAddress(privateKey.PublicKey)
	return privateKeyStr, address.Hex()
}

func getEnvBool(key string, defaultVal bool) bool {
	val, ok := os.LookupEnv(key)
	if !ok {
		return defaultVal
	}
	parsed, err := strconv.ParseBool(val)
	if err != nil {
		log.Printf("Invalid value for %s: %v, defaulting to %v", key, val, defaultVal)
		return defaultVal
	}
	return parsed
}
