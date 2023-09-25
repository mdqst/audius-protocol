import retry from 'async-retry'
import axios, { AxiosRequestConfig } from 'axios'
import FormData from 'form-data'

import type { StorageNodeSelectorService } from '../../sdk'
import type { UserStateManager } from '../../userStateManager'
import { Nullable, TrackMetadata, UserMetadata, Utils, uuid } from '../../utils'
import { hashAndSign, sortObjectKeys } from '../../utils/apiSigning'
import {
  userSchemaType,
  trackSchemaType,
  playlistSchemaType,
  Schemas
} from '../schemaValidator/SchemaValidator'
import type { MonitoringCallbacks } from '../types'
import type { Web3Manager } from '../web3Manager'

const { wait } = Utils

const MAX_TRACK_TRANSCODE_TIMEOUT = 3600000 // 1 hour
const MAX_IMAGE_RESIZE_TIMEOUT_MS = 5 * 60_000 // 5 minutes
const POLL_STATUS_INTERVAL = 1000 // 1s

type PlaylistTrackId = { time: number; track: number }

type PlaylistContents = {
  track_ids: PlaylistTrackId[]
}

export type PlaylistMetadata = {
  playlist_contents: PlaylistContents
  playlist_id: number
  playlist_name: string
  playlist_image_sizes_multihash: string
  description: string
  is_album: boolean
  is_private: boolean
  is_image_autogenerated: boolean
}

export type ProgressCB = (
  progress:
    | {
        art: {
          upload?: { loaded: number; total: number }
          transcode?: { decimal: number }
          resize?: undefined
        }
      }
    | {
        audio: {
          upload?: { loaded: number; total: number }
          transcode?: { decimal: number }
          resize?: undefined
        }
      }
) => void

export type CreatorNodeConfig = {
  web3Manager: Web3Manager
  // fallback creator node endpoint (to be deprecated)
  creatorNodeEndpoint: string
  isServer: boolean
  // singleton UserStateManager instance
  userStateManager: UserStateManager
  schemas: Schemas
  // whether or not to include only specified nodes (default null)
  passList: Set<string> | null
  // whether or not to exclude any nodes (default null)
  blockList: Set<string> | null
  // callbacks to be invoked with metrics from requests sent to a service
  monitoringCallbacks: MonitoringCallbacks
  fallbackUrl: string
  storageNodeSelector: StorageNodeSelectorService
}

// Currently only supports a single logged-in audius user
export class CreatorNode {
  /* Static Utils */

  /* -------------- */

  web3Manager: Nullable<Web3Manager>
  creatorNodeEndpoint: string
  isServer: boolean
  userStateManager: UserStateManager
  schemas: Schemas | undefined
  passList: Set<string> | null
  blockList: Set<string> | null
  monitoringCallbacks: MonitoringCallbacks
  maxBlockNumber: number
  storageNodeSelector: StorageNodeSelectorService

  /**
   * Constructs a service class for a creator node
   */
  constructor(
    web3Manager: Nullable<Web3Manager>,
    creatorNodeEndpoint: string,
    isServer: boolean,
    userStateManager: UserStateManager,
    schemas: Schemas | undefined,
    passList: Set<string> | null = null,
    blockList: Set<string> | null = null,
    monitoringCallbacks: MonitoringCallbacks = {},
    storageNodeSelector: StorageNodeSelectorService
  ) {
    this.web3Manager = web3Manager
    // This is just 1 endpoint (primary), unlike the creator_node_endpoint field in user metadata
    this.creatorNodeEndpoint = creatorNodeEndpoint
    this.isServer = isServer
    this.userStateManager = userStateManager
    this.schemas = schemas

    this.maxBlockNumber = 0

    this.passList = passList
    this.blockList = blockList
    this.monitoringCallbacks = monitoringCallbacks
    this.storageNodeSelector = storageNodeSelector
  }

  async init() {
    if (!this.web3Manager) throw new Error('Failed to initialize CreatorNode')
  }

  // Throws an error upon validation failure
  validatePlaylistSchema(metadata: PlaylistMetadata) {
    this.schemas?.[playlistSchemaType].validate?.(metadata)
  }

  // Throws an error upon validation failure
  validateUserSchema(metadata: UserMetadata) {
    this.schemas?.[userSchemaType].validate?.(metadata)
  }

  // Throws an error upon validation failure
  validateTrackSchema(metadata: TrackMetadata) {
    this.schemas?.[trackSchemaType].validate?.(metadata)
  }

  getEndpoint() {
    return this.creatorNodeEndpoint
  }

  /**
   * Switch from one creatorNodeEndpoint to another
   */
  async setEndpoint(creatorNodeEndpoint: string) {
    this.creatorNodeEndpoint = creatorNodeEndpoint
  }

  async transcodeTrackPreview(metadata: TrackMetadata): Promise<TrackMetadata> {
    if (metadata.preview_start_seconds == null) {
      throw new Error('No track preview start time specified')
    }
    if (!metadata.audio_upload_id) {
      throw new Error('Missing required audio_upload_id')
    }
    const updatedMetadata = { ...metadata }
    const data = {
      previewStartSeconds: metadata.preview_start_seconds.toString()
    }
    const resp = await this._retry3(
      async () => await this.editFileV2(metadata.audio_upload_id!, data),
      (e) => {
        console.info('Retrying editFileV2', e)
      }
    )

    // Update metadata with new track preview cid
    const previewKey = `320_preview|${updatedMetadata.preview_start_seconds}`
    updatedMetadata.preview_cid = resp.results[previewKey]

    return updatedMetadata
  }

  async uploadTrackAudioAndCoverArtV2(
    trackFile: File,
    coverArtFile: File,
    metadata: TrackMetadata,
    onProgress: ProgressCB
  ): Promise<TrackMetadata> {
    const updatedMetadata = { ...metadata }
    const audioUploadOpts: { [key: string]: string } = {}
    if (updatedMetadata.preview_start_seconds != null) {
      audioUploadOpts.previewStartSeconds =
        updatedMetadata.preview_start_seconds.toString()
    }

    // Upload audio and cover art
    const promises = [
      this._retry3(
        async () =>
          await this.uploadTrackAudioV2(trackFile, onProgress, audioUploadOpts),
        (e) => {
          console.info('Retrying uploadTrackAudioV2', e)
        }
      )
    ]
    if (coverArtFile) {
      promises.push(
        this._retry3(
          async () =>
            await this.uploadTrackCoverArtV2(coverArtFile, onProgress),
          (e) => {
            console.info('Retrying uploadTrackCoverArtV2', e)
          }
        )
      )
    }
    const [audioResp, coverArtResp] = await Promise.all(promises)

    // Update metadata to include uploaded CIDs
    updatedMetadata.track_segments = []
    updatedMetadata.duration = parseInt(audioResp.probe.format.duration, 10)
    updatedMetadata.track_cid = audioResp.results['320']
    if (updatedMetadata.preview_start_seconds != null) {
      const previewKey = `320_preview|${updatedMetadata.preview_start_seconds}`
      updatedMetadata.preview_cid = audioResp.results[previewKey]
    }
    updatedMetadata.audio_upload_id = audioResp.id
    if (updatedMetadata.download?.is_downloadable) {
      updatedMetadata.download.cid = updatedMetadata.track_cid
    }
    if (coverArtResp) updatedMetadata.cover_art_sizes = coverArtResp.id

    return updatedMetadata
  }

  async uploadTrackAudioV2(
    file: File,
    onProgress: ProgressCB,
    options?: { [key: string]: string }
  ) {
    return await this.uploadFileV2(file, onProgress, 'audio', options)
  }

  async uploadTrackCoverArtV2(file: File, onProgress: ProgressCB = () => {}) {
    return await this.uploadFileV2(file, onProgress, 'img_square')
  }

  async uploadProfilePictureV2(file: File, onProgress: ProgressCB = () => {}) {
    return await this.uploadFileV2(file, onProgress, 'img_square')
  }

  async uploadCoverPhotoV2(file: File, onProgress: ProgressCB = () => {}) {
    return await this.uploadFileV2(file, onProgress, 'img_backdrop')
  }

  async editFileV2(
    uploadId: string,
    data: { [key: string]: string },
    onProgress?: ProgressCB
  ) {
    const myPrivateKey = this.web3Manager?.getOwnerWalletPrivateKey()
    if (!myPrivateKey) {
      throw new Error('Missing user private key')
    }

    // Generate signature
    const signatureData = {
      upload_id: uploadId,
      timestamp: Date.now()
    }
    const signature = await hashAndSign(
      JSON.stringify(sortObjectKeys(signatureData)),
      '0x' + myPrivateKey.toString('hex')
    )
    const signatureEnvelope = {
      data: JSON.stringify(signatureData),
      signature
    }

    const headers = {
      'X-Request-ID': uuid()
    }
    const response = await this._makeRequestV2({
      method: 'post',
      url: `/uploads/${uploadId}`,
      data,
      params: { signature: JSON.stringify(signatureEnvelope) },
      headers
    })

    // Poll for re-transcoding to complete
    return await this.pollProcessingStatusV2(
      uploadId,
      response.data.template,
      onProgress
    )
  }

  async uploadFileV2(
    file: File,
    onProgress: ProgressCB,
    template: 'audio' | 'img_square' | 'img_backdrop',
    options?: { [key: string]: string }
  ) {
    const { headers, formData } = this.createFormDataAndUploadHeadersV2(file, {
      template,
      ...options
    })
    const response = await this._makeRequestV2({
      method: 'post',
      url: '/uploads',
      data: formData,
      headers,
      onUploadProgress: (progressEvent) => {
        const progress = {
          upload: { loaded: progressEvent.loaded, total: progressEvent.total }
        }
        onProgress(
          template === 'audio' ? { audio: progress } : { art: progress }
        )
      }
    })
    return await this.pollProcessingStatusV2(
      response.data[0].id,
      template,
      onProgress
    )
  }

  /**
   * Works for both track transcode and image resize jobs
   * @param id ID of the transcode/resize job
   * @param maxPollingMs millis to stop polling and error if job is not done
   * @returns successful job info, or throws error if job fails / times out
   */
  async pollProcessingStatusV2(
    id: string,
    template: string,
    onProgress?: ProgressCB
  ) {
    const start = Date.now()
    const maxPollingMs =
      template === 'audio'
        ? MAX_TRACK_TRANSCODE_TIMEOUT
        : MAX_IMAGE_RESIZE_TIMEOUT_MS
    while (Date.now() - start < maxPollingMs) {
      try {
        const resp = await this.getProcessingStatusV2(id)
        if (template === 'audio' && resp.transcode_progress) {
          onProgress?.({
            audio: {
              transcode: { decimal: resp.transcode_progress }
            }
          })
        }
        if (resp?.status === 'done') return resp
        if (
          resp?.status === 'error' ||
          resp?.status === 'error_retranscode_preview'
        ) {
          throw new Error(
            `Upload failed: id=${id}, resp=${JSON.stringify(resp)}`
          )
        }
      } catch (e: any) {
        // Rethrow if error is "Upload failed" or if status code is 422 (Unprocessable Entity)
        if (
          e.message?.startsWith('Upload failed') ||
          (e.response && e.response?.status === 422)
        ) {
          throw e
        }

        // Swallow errors caused by failure to establish connection to node so we can retry polling
        console.error(`Failed to poll for processing status, ${e}`)
      }

      await wait(POLL_STATUS_INTERVAL)
    }

    throw new Error(`Upload took over ${maxPollingMs}ms. id=${id}`)
  }

  /**
   * Gets the task progress given the task type and id associated with the job
   * @param id the id of the transcoding or resizing job
   * @returns the status, and the success or failed response if the job is complete
   */
  async getProcessingStatusV2(id: string) {
    const { data } = await this._makeRequestV2({
      method: 'get',
      url: `/uploads/${id}`
    })
    return data
  }

  /* ------- INTERNAL FUNCTIONS ------- */

  /**
   * Makes an axios request to this.creatorNodeEndpoint
   * @return response body
   */
  async _makeRequestV2(axiosRequestObj: AxiosRequestConfig) {
    // TODO: This might want to have other error handling, request UUIDs, etc...
    //       But I didn't want to pull in all the chaos and incompatiblity of the old _makeRequest
    axiosRequestObj.baseURL = this.creatorNodeEndpoint
    try {
      return await axios(axiosRequestObj)
    } catch (e: any) {
      const wallet = this.userStateManager.getCurrentUser()?.wallet
      const storageNodes = this.storageNodeSelector.getNodes(wallet ?? '')

      for (const storageNode of storageNodes) {
        try {
          axiosRequestObj.baseURL = storageNode
          return await axios(axiosRequestObj)
        } catch (e) {
          // continue
        }
      }

      const requestId = axiosRequestObj.headers['X-Request-ID']
      const msg = `Error sending storagev2 request for X-Request-ID=${requestId}, tried all storage nodes: ${e}`
      console.error(msg)
      throw new Error(msg)
    }
  }

  /**
   * Create headers and formData for file upload
   * @param file the file to upload
   * @returns headers and formData in an object
   */
  createFormDataAndUploadHeadersV2(
    file: File,
    extraFormDataOptions: Record<string, unknown> = {}
  ) {
    // form data is from browser, not imported npm module
    const formData = new FormData()
    formData.append('files', file, file.name)
    Object.keys(extraFormDataOptions).forEach((key) => {
      formData.append(key, `${extraFormDataOptions[key]}`)
    })

    let headers: Record<string, string | null> = {}
    if (this.isServer) {
      headers = formData.getHeaders()
    }

    const requestId = uuid()
    headers['X-Request-ID'] = requestId

    const user = this.userStateManager.getCurrentUser()
    if (user?.wallet && user.user_id) {
      headers['X-User-Wallet-Addr'] = user.wallet
      headers['X-User-Id'] = user.user_id as unknown as string
    }

    return { headers, formData }
  }

  /**
   * Calls fn and then retries once after 500ms, again after 1500ms, and again after 4000ms
   */
  async _retry3(fn: () => Promise<any>, onRetry = (_err: any) => {}) {
    return await retry(fn, {
      minTimeout: 500,
      maxTimeout: 4000,
      factor: 3,
      retries: 3,
      onRetry
    })
  }
}
