import { randomBytes, randomInt } from 'crypto'
import chalk from 'chalk'
import { program } from 'commander'

import { initializeAudiusLibs } from './utils.mjs'

program
  .command('create-playlist')
  .description('Create playlist')
  .argument('<trackIds...>', 'Tracks to include in playlist')
  .option(
    '-n, --name <name>',
    'Name of playlist (chosen randomly if not specified)'
  )
  .option('-a, --album', 'Make playlist an album', false)
  .option(
    '-d, --description <description>',
    'Description of playlist (chosen randomly if not specified)'
  )
  .option('-p, --private', 'Make playlist private', false)
  .option(
    '-u, --price <price>',
    'The price for the album. Cannot be used without --album option'
  )
  .option('-f, --from <from>', 'The account to create playlist from')
  .action(
    async (
      trackIds,
      { name, album, description, price, private: isPrivate, from }
    ) => {
      const audiusLibs = await initializeAudiusLibs(from)
      const rand = randomBytes(2).toString('hex').padStart(4, '0').toUpperCase()

      try {
        const playlistId = randomInt(400_001, 40_000_000)
        const playlistName = name || `playlist ${rand}`
        const metadata = {
          playlist_id: playlistId,
          playlist_name: playlistName,
          description:
            description || `playlist generated by audius-cmd ${rand}`,
          is_album: album,
          is_private: isPrivate,
          playlist_contents: {
            track_ids: trackIds.map((trackId) => ({
              track: Number(trackId),
              metadata_time: Date.now() / 1000
            }))
          }
        }
        if (price) {
          if (!album) {
            program.error(chalk.red('Price can only be set for albums'))
          }
          metadata.is_stream_gated = true
          metadata.stream_conditions = await getStreamConditions({
            price,
            audiusLibs
          })
        }
        const response = await audiusLibs.EntityManager.createPlaylist(metadata)

        if (response.error) {
          program.error(chalk.red(response.error))
        }

        console.log(chalk.green('Successfully created playlist'))
        console.log(chalk.yellow('Playlist Name: '), playlistName)
        console.log(chalk.yellow('Playlist ID:   '), playlistId)
      } catch (err) {
        program.error(err.message)
      }

      process.exit(0)
    }
  )

const getStreamConditions = async ({ price: priceString, audiusLibs }) => {
  if (priceString) {
    const price = Number.parseInt(priceString)
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error(`Invalid price "${priceString}"`)
    }
    const { userbank } =
      await audiusLibs.solanaWeb3Manager.createUserBankIfNeeded({
        mint: 'usdc'
      })
    return {
      usdc_purchase: {
        price,
        splits: { [userbank.toString()]: price * 10 ** 4 }
      }
    }
  }
  return null
}
