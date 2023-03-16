package discovery

import (
	"expvar"
	"log"
	"time"

	"comms.audius.co/discovery/config"
	"comms.audius.co/discovery/db"
	"comms.audius.co/discovery/pubkeystore"
	"comms.audius.co/discovery/rpcz"
	"comms.audius.co/discovery/server"
	"comms.audius.co/shared/peering"
	"github.com/nats-io/nats.go"
	"golang.org/x/sync/errgroup"
)

func DiscoveryMain() {
	// dial datasources in parallel
	g := errgroup.Group{}

	var jsc nats.JetStreamContext
	var proc *rpcz.RPCProcessor

	g.Go(func() error {
		discoveryConfig := config.GetDiscoveryConfig()
		peering, err := peering.New(&discoveryConfig.PeeringConfig)
		if err != nil {
			return err
		}

		err = peering.PollRegisteredNodes()
		if err != nil {
			return err
		}

		peerMap := peering.Solicit()

		jsc, err = peering.DialJetstream(peerMap)
		if err != nil {
			log.Println("jetstream dial failed", err)
			return err
		}

		// create RPC processor
		proc, err = rpcz.NewProcessor(jsc)
		if err != nil {
			return err
		}

		err = pubkeystore.Dial()
		if err != nil {
			return err
		}

		go pubkeystore.StartPubkeyBackfill()

		return nil

	})
	g.Go(func() error {
		return db.Dial()
	})
	g.Go(func() error {
		return db.RunMigrations()
	})
	if err := g.Wait(); err != nil {
		log.Fatal(err)
	}

	expvar.NewString("booted_at").Set(time.Now().UTC().String())

	// Start comms server on :8925
	e := server.NewServer(jsc, proc)
	e.Logger.Fatal(e.Start(":8925"))
}
