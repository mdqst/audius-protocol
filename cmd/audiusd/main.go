package main

import (
	"context"
	"encoding/hex"
	"flag"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"syscall"

	"log"

	"github.com/AudiusProject/audius-protocol/core/common"
	"github.com/AudiusProject/audius-protocol/core/core_pkg"

	"github.com/AudiusProject/audius-protocol/mediorum/mediorum_pkg"
	"github.com/AudiusProject/audius-protocol/pkg/uptime"

	"github.com/ethereum/go-ethereum/crypto"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	noTLS := flag.Bool("no-tls", false, "Disable TLS and use only port 80")
	noMediorum := flag.Bool("no-mediorum", false, "Disable Mediorum i.e. core node only")
	flag.Parse()

	logger := common.NewLogger(nil)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// make it work out of the box with no config
	// TODO: for now, this requires the use of --no-mediorum
	// as that code is heavily tied into on chain registration
	delegatePrivateKey := os.Getenv("delegatePrivateKey")
	if delegatePrivateKey == "" {
		delegatePrivateKey, delegateOwnerWallet := keyGen()
		os.Setenv("delegatePrivateKey", delegatePrivateKey)
		os.Setenv("delegateOwnerWallet", delegateOwnerWallet)
		logger.Infof("Generated and set delegate key pair: %s", delegateOwnerWallet)
	}

	go func() {
		if err := startEchoProxyWithOptionalTLS(*noTLS); err != nil {
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
		if err := core_pkg.Run(ctx, logger); err != nil {
			logger.Errorf("fatal core error: %v", err)
			cancel()
		}
	}()

	if !*noMediorum {
		go func() {
			if err := mediorum_pkg.Run(ctx, logger); err != nil {
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

func startEchoProxyWithOptionalTLS(noTLS bool) error {
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

	if noTLS {
		return e.Start(":80")
	}

	e.AutoTLSManager.Cache = autocert.DirCache("/var/www/.cache")
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
