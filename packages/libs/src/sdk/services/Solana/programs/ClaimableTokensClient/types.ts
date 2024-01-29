import type { PublicKey } from '@solana/web3.js'
import { z } from 'zod'

import type { Prettify } from '../../../../utils/prettify'
import type { AuthService } from '../../../Auth'
import {
  Mint,
  MintSchema,
  PublicKeySchema,
  SolanaWalletAdapter
} from '../../types'
import type { BaseSolanaProgramConfigInternal } from '../types'

export type ClaimableTokensConfigInternal = {
  /** The program ID of the ClaimableTokensProgram instance. */
  programId: PublicKey
  /** Map from token mint name to public key address. */
  mints: Record<Mint, PublicKey>
} & BaseSolanaProgramConfigInternal

export type ClaimableTokensConfig = Prettify<
  Partial<Omit<ClaimableTokensConfigInternal, 'mints'>> & {
    mints?: Prettify<Partial<Record<Mint, PublicKey>>>
    solanaWalletAdapter: SolanaWalletAdapter
  }
>

export const GetOrCreateUserBankSchema = z
  .object({
    /** The user's Ethereum wallet. */
    ethWallet: z.string(),
    /** The name of the token mint. */
    mint: MintSchema,
    /**
     * The public key of the account that will be paying the
     * account creation and transaction fees.
     */
    feePayer: PublicKeySchema.optional()
  })
  .strict()

export type GetOrCreateUserBankRequest = z.infer<
  typeof GetOrCreateUserBankSchema
>

export const DeriveUserBankSchema = z
  .object({
    /** The user's Ethereum wallet. */
    ethWallet: z.string(),
    /** The name of the token mint. */
    mint: MintSchema
  })
  .strict()

export type DeriveUserBankRequest = z.infer<typeof DeriveUserBankSchema>

export const CreateTransferSchema = z.object({
  /** The public key of the account that will be paying the transaction fees. */
  feePayer: PublicKeySchema.optional(),
  /** The sending user's Ethereum wallet. */
  ethWallet: z.string(),
  /** The name of the token mint. */
  mint: MintSchema,
  /** The public key of the destination account. */
  destination: PublicKeySchema
})

export type CreateTransferRequest = z.infer<typeof CreateTransferSchema>

export const CreateSecpSchema = z
  .object({
    /** The sending user's Ethereum wallet. */
    ethWallet: z.string(),
    /** The public key of the destination account. */
    destination: PublicKeySchema,
    /** The amount to send, either in "lamports"/"wei" (bigint) or decimal number. */
    amount: z.union([z.bigint(), z.number()]),
    /** The name of the token mint. */
    mint: MintSchema,
    /** The index of this instruction within the transaction. */
    instructionIndex: z.number().optional(),
    /** The auth service for signing the instruction data. */
    auth: z.custom<AuthService>()
  })
  .strict()

export type CreateSecpRequest = z.infer<typeof CreateSecpSchema>
