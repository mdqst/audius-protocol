import express from 'express'
import { json } from 'body-parser'
import cors from 'cors'
import { config } from './config'
import { logger } from './logger'
import {
  incomingRequestLogger,
  outgoingRequestLogger
} from './middleware/logging'
import { relay } from './routes/relay/relay'
import { errorHandlerMiddleware } from './middleware/errorHandler'
import {
  userSignerRecoveryMiddleware,
  discoveryNodeSignerRecoveryMiddleware
} from './middleware/signerRecovery'
import { cache } from './routes/cache'
import { feePayer } from './routes/feePayer'
import { health } from './routes/health/health'
import { listenHandler } from './routes/listens/listens'
import { getLibs, getSdk } from './sdk'

const main = async () => {
  // init sdk and libs before web server
  await Promise.all([getSdk, getLibs])

  const { serverHost, serverPort } = config
  const app = express()
  app.use(json())
  app.use(cors())
  app.use(incomingRequestLogger)
  app.get('/solana/health_check', health)
  app.use(userSignerRecoveryMiddleware)
  app.use(discoveryNodeSignerRecoveryMiddleware)
  app.post('/solana/relay', relay)
  app.post('/solana/cache', cache)
  app.get('/solana/feePayer', feePayer)
  app.post('/tracks/:trackId/listen', listenHandler)
  app.use(outgoingRequestLogger)
  app.use(errorHandlerMiddleware)

  app.listen(serverPort, serverHost, () => {
    logger.info({ serverHost, serverPort }, 'server initialized')
  })
}

main().catch(logger.error.bind(logger))
