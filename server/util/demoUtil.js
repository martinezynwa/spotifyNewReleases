import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const User = require('../models/User.cjs')
import axios from 'axios'

const demoGetToken = async () => {
  let accessToken = ''
  const user = await User.find({ spotify_id: process.env.SPOTIFY_ID_TEST })

  //step 1 - getting new access token from refresh token
  await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user[0].refreshToken,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
  })
    .then(async res => {
      accessToken = res.data.access_token
    })
    .catch(async err => {
      await logService.addLogToDatabase({
        username: process.env.SPOTIFY_ID,
        action: 'jobs-refresh_token',
        message: err.response.data.error_description,
        status: err.response.data.error,
        baseUrl: err.config.baseURL,
        url: err.config.url,
      })
    })

  return accessToken
}

export default {
  demoGetToken,
}
