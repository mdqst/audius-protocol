export const externalLinkAllowList = new Set([
  'facebook.com',
  'instagram.com',
  'tiktok.com',
  'twitter.com',
  'x.com',
  'audius.co',
  'discord.gg',
  'solscan.io'
])

export const isAllowedExternalLink = (link: string) => {
  try {
    let hostname = new URL(link).hostname
    hostname = hostname.replace(/^www\./, '')
    return externalLinkAllowList.has(hostname)
  } catch (e) {
    return false
  }
}

export const makeSolanaTransactionLink = (signature: string) => {
  return `https://solscan.io/tx/${signature}`
}
