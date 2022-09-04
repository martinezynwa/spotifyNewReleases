import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import schedule from 'node-schedule'
import axios from 'axios'
import logService from '../util/logger.js'

const User = require('../models/User.cjs')

const runJobs = () => {
  schedule.scheduleJob('00 01 * * * ', async () => {
    let accessToken = ''

    //step 1 - getting new access token from refresh token
    const user = await User.find({ spotify_id: process.env.SPOTIFY_ID })
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
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
          action: 'jobs-refresh_token',
          message: 'success',
        })
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

    //step 2 - synchronize newly followed artists
    await axios
      .get(`${process.env.BACKEND_URI}/spotify/sync`, {
        params: {
          accessToken,
          userId: process.env.SPOTIFY_ID,
        },
      })
      .then(async res => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
          action: 'jobs-spotify/sync',
          message: `Synced ${
            res.data.length !== 0 ? res.data.length : '0'
          } new artists`,
        })
      })
      .catch(async err => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
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
          userId: process.env.SPOTIFY_ID,
        },
      })
      .then(async res => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
          action: 'jobs-spotify/remove',
          message: `Unfollowed ${
            res.data.length !== 0 ? res.data.length : '0'
          } artists`,
        })
      })
      .catch(async err => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
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
          userId: process.env.SPOTIFY_ID,
        },
      })
      .then(async res => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
          action: 'jobs-releases/all',
          message: `Added ${
            res.data.length !== 0 ? res.data.length : '0'
          } new albums/singles`,
        })
      })
      .catch(async err => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
          action: 'jobs-releases/all',
          message: err.response.data.error.message,
          status: err.response.data.error.status,
          baseUrl: err.config.baseURL,
          url: err.config.url,
        })
      })

    //step 5 - update releases page
    await axios
      .get(`${process.env.BACKEND_URI}/releases/update`, {
        params: {
          accessToken,
          userId: process.env.SPOTIFY_ID,
        },
      })
      .then(async res => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
          action: 'jobs-releases/update',
          message: `Updated releases with ${
            res.data.length !== 0 ? res.data.length : '0'
          } records`,
        })
      })
      .catch(async err => {
        await logService.addLogToDatabase({
          username: process.env.SPOTIFY_ID,
          action: 'jobs-releases/update',
          message: err.response.data.error.message,
          status: err.response.data.error.status,
          baseUrl: err.config.baseURL,
          url: err.config.url,
        })
      })
  })
}

export default {
  runJobs,
}
