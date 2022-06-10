const axios = require('axios')
const models = require('../models')
const { REMOTE_VARS, getRemoteVar } = require('../remoteConfig')
const config = require('../config.js')

const aaoEndpoint = config.get('aaoEndpoint') || 'https://antiabuseoracle.audius.co'

const getAbuseAttestation = async (challengeId, handle, reqIP) => {
  const res = await axios.post(`${aaoEndpoint}/attestation/${handle}`, {
    challengeId,
    challengeSpecifier: handle,
    amount: 0
  }, {
    headers: {
      'X-Forwarded-For': reqIP
    }
  })

  console.log('AAO said', res)

  return res
}

const detectAbuse = async (challengeId, walletAddress, reqIP) => {
  let isAbusive = false

  const user = await models.User.findOne({
    where: { walletAddress },
    attributes: ['blockchainUserId', 'walletAddress', 'handle', 'isAbusive']
  })
  if (!user.handle) {
    // Something went wrong during sign up and identity has no knowledge
    // of this user's handle. Flag them as abusive.
    isAbusive = true
  } else {
    const { result } = await getAbuseAttestation(challengeId, handle, reqIP)
    if (!result) {
      // The anti abuse system deems them abusive. Flag them as such.
      isAbusive = true
    }
  }
  if (user.isAbusive !== isAbusive) {
    await user.update({ isAbusive })
  }
}

module.exports = {
  getAbuseAttestation,
  detectAbuse
}