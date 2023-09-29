import type { AudiusLibs } from '@audius/sdk'
import { parameterizedAuthMiddleware } from '../../authMiddleware'
import express, { RequestHandler } from 'express'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import type Logger from 'bunyan'

import { InvalidRelayInstructionError } from './InvalidRelayInstructionError'

import { FEATURE_FLAGS, getFeatureFlag } from '../../featureFlag'
import {
  errorResponseBadRequest,
  errorResponseServerError,
  handleResponse,
  successResponse
} from '../../apiHelpers'

import crypto from 'crypto'
import { assertRelayAllowedInstructions } from './solanaRelayChecks'

type AccountMetaJSON = {
  pubkey: string
  isSigner: boolean
  isWritable: boolean
}

type TransactionInstructionJSON = {
  keys: AccountMetaJSON[]
  programId: string
  data: number[]
}

type RelayRequestBody = {
  instructions: TransactionInstructionJSON[]
  skipPreflight: boolean
  feePayerOverride: string
  signatures: { signature: number[]; publicKey: string }[]
  retry: boolean
  recentBlockhash: string
  lookupTableAddresses: string[]
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        walletAddress?: string
        handle: string
        blockchainUserId: number
      }
      logger: Logger
    }
  }
}

const isMalformedInstruction = (instr: TransactionInstructionJSON) =>
  !instr ||
  !Array.isArray(instr.keys) ||
  !instr.data ||
  !instr.keys.every((key) => !!key.pubkey)

const solanaRouter = express.Router()
solanaRouter.post(
  '/relay',
  parameterizedAuthMiddleware({ shouldRespondBadRequest: false }),
  handleResponse(<RequestHandler<any, any, RelayRequestBody>>(async (
    req,
    res,
    next
  ) => {
    const redis = req.app.get('redis')
    const libs: AudiusLibs = req.app.get('audiusLibs')
    const logger = req.logger
    try {
      // Check to see if social proof is required for claimable token transfers
      // Note: Currently would affect tipping
      let optimizelyClient
      let socialProofEnabled = false
      try {
        optimizelyClient = req.app.get('optimizelyClient')
        socialProofEnabled = getFeatureFlag(
          optimizelyClient,
          FEATURE_FLAGS.SOCIAL_PROOF_TO_SEND_AUDIO_ENABLED
        )
      } catch (error) {
        logger.error(
          `Failed to retrieve optimizely feature flag for socialProofRequiredToSend: ${error}`
        )
      }

      const {
        instructions: instructionsJSON = [],
        skipPreflight,
        feePayerOverride,
        signatures = [],
        retry = true,
        recentBlockhash,
        lookupTableAddresses = []
      } = req.body

      // Ensure instructions are formed correctly
      instructionsJSON.forEach((instr, i) => {
        if (isMalformedInstruction(instr)) {
          throw new InvalidRelayInstructionError(i, 'Instruction malformed')
        }
      })

      // Parse transactions into TransactionInstructions
      const instructions = instructionsJSON.map((instr) => {
        const keys = instr.keys.map((key) => ({
          pubkey: new PublicKey(key.pubkey),
          isSigner: key.isSigner,
          isWritable: key.isWritable
        }))
        return new TransactionInstruction({
          keys,
          programId: new PublicKey(instr.programId),
          data: Buffer.from(instr.data)
        })
      })

      // Check that the instructions are allowed for relay
      await assertRelayAllowedInstructions(
        instructions,
        req.user,
        socialProofEnabled
      )

      // Send transaction using transaction handler
      const transactionHandler = libs.solanaWeb3Manager!.transactionHandler
      const {
        res: transactionSignature,
        error,
        errorCode
      } = await transactionHandler.handleTransaction({
        recentBlockhash,
        signatures: (signatures || []).map((s) => ({
          ...s,
          signature: Buffer.from(s.signature)
        })),
        instructions,
        skipPreflight,
        // @ts-ignore TODO: This will be fixed when SDK updates
        feePayerOverride,
        lookupTableAddresses,
        retry
      })

      if (error) {
        const reqBodySHA = crypto
          .createHash('sha256')
          .update(JSON.stringify({ instructions: instructionsJSON }))
          .digest('hex')
        // if the tx fails, store it in redis with a 24 hour expiration
        await redis.setex(
          `solanaFailedTx:${reqBodySHA}`,
          60 /* seconds */ * 60 /* minutes */ * 24 /* hours */,
          JSON.stringify(req.body)
        )
        req.logger.error('Error in solana transaction:', error, reqBodySHA)
        const errorString = `Something caused the solana transaction to fail for payload ${reqBodySHA}`
        return errorResponseServerError(errorString, { errorCode, error })
      }
      return successResponse({ transactionSignature })
    } catch (e) {
      logger.error(e)
      if (e instanceof InvalidRelayInstructionError) {
        return errorResponseBadRequest('Invalid Relay Instructions')
      }
      return errorResponseServerError('Something went wrong')
    }
  }))
)

export default solanaRouter
