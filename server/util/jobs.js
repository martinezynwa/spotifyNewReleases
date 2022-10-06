import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import logService from '../util/logger.js'

const cron = require('node-cron')
const User = require('../models/User.cjs')
const Release = require('../models/Release.cjs')
import { day60DaysAgo } from '../util/day60DaysAgo.js'

const initJobs = async () => {
  const runEveryDay = cron.schedule('30 03 * * *', async () => {
    const users = await User.find()

    for (let user of users) {
      let accessToken = ''

      await logService.addLogToDatabase({
        username: user.spotify_id,
        action: 'job started',
        message: 'Schedule triggered',
      })

      //step 1 - getting new access token from refresh token
      await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
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
            username: user.spotify_id,
            action: 'jobs-refresh_token',
            message: err.response.data.error_description,
            status: err.response.data.error,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
        })

      //step 2 - synchronize newly followed artists
      await axios
        .get(`${process.env.BACKEND_URI}/spotify/sync`, {
          params: {
            accessToken,
            userId: user.spotify_id,
          },
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-spotify/sync',
            message: err.response.data.error.message,
            status: err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
        })

      //step 3 - remove unfollowed artists
      await axios
        .get(`${process.env.BACKEND_URI}/spotify/remove`, {
          params: {
            accessToken,
            userId: user.spotify_id,
          },
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-spotify/remove',
            message: err.response.data.error.message,
            status: err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
        })

      //step 4 - get new releases
      await axios
        .get(`${process.env.BACKEND_URI}/releases/all`, {
          params: {
            accessToken,
            userId: user.spotify_id,
          },
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-releases/all',
            message: err.response.data.error.message,
            status: err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
        })

      await logService.addLogToDatabase({
        username: user.spotify_id,
        action: 'test',
        message: `lastFetchNewArtistsSync: ${user.lastFetchNewArtistsSync} lastFetchNewAlbumsAdded: ${user.lastFetchNewAlbumsAdded}`,
      })

      //step 5 - update releases page
      if (!user.lastFetchNewArtistsSync && !user.lastFetchNewAlbumsAdded) {
        await logService.addLogToDatabase({
          username: user.spotify_id,
          action: 'releases/update',
          message: 'No new releases added',
        })
        await Release.deleteMany({ releaseDate: { $lt: day60DaysAgo } })
      } else {
        await axios
          .get(`${process.env.BACKEND_URI}/releases/update`, {
            params: {
              accessToken,
              userId: user.spotify_id,
              job: true,
            },
          })
          .catch(async err => {
            await logService.addLogToDatabase({
              username: user.spotify_id,
              action: 'jobs-releases/update',
              message: err.response.data.error.message,
              status: err.response.data.error.status,
              baseUrl: err.config.baseURL,
              url: err.config.url,
            })
          })
      }
    }
  })
  runEveryDay.start()
}

export default initJobs
