import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import axios from 'axios'
import dayjs from 'dayjs'
import logService from '../util/logger.js'
import { loginUrl } from '../util/loginUrl.js'

const User = require('../models/User.cjs')
const router = express.Router()

router.get('/login', async (request, response) => {
  response.redirect(loginUrl)
})

router.get('/callback', async (request, response) => {
  const code = request.query.code || null

  //logging-in & obtaining tokens
  let res = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
  })
    .then(res => {
      return res.data
    })
    .catch(async err => {
      await logService.addLogToDatabase({
        username: null,
        action: 'callback',
        message: err.response.data.error_description,
        status: err.response.data.error,
        baseUrl: err.config.baseURL,
        url: err.config.url,
      })
      return {
        error: true,
        status: err.response.data.error,
        message: err.response.data.error_description,
      }
    })

  if (res?.error) {
    response.json(res.message)
    return
  }

  const { access_token, refresh_token, expires_in } = res

  //get user data
  res = await axios
    .get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })
    .then(res => {
      return res
    })
    .catch(async err => {
      await logService.addLogToDatabase({
        username: null,
        action: 'get user data',
        message: err.response.data.error.message,
        status: err.response.data.error.status,
        baseUrl: err.config.baseURL,
        url: err.config.url,
      })
      return {
        error: true,
        status: err.response.data.error.status,
        message: err.response.data.error.message,
      }
    })

  if (res?.error) {
    response.json(res.message)
    return
  }

  //check if user exists in mongoDB
  const user = await User.findOne({ spotify_id: res.data.id })

  if (user) {
    //user exists, only update refresh token
    await User.findOneAndUpdate(
      { spotify_id: res.data.id },
      {
        $set: {
          refreshToken: refresh_token,
        },
      },
    )
  } else {
    //add user into database
    const newUser = new User({
      spotify_id: res.data.id,
      spotify_name: res.data.display_name,
      registeredAt: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      lastFetchDate: dayjs(new Date()).format('YYYY-MM-DD'),
      refreshToken: refresh_token,
    })
    await newUser.save()
  }

  //return tokens to client
  const queryParams = new URLSearchParams({
    access_token,
    refresh_token,
    expires_in,
  })
  response.redirect(`http://localhost:3000/?${queryParams}`)
})

router.get('/refresh_token', async (request, response) => {
  const { refresh_token } = request.query

  const res = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
  })
    .then(res => {
      response.send(res.data)
    })
    .catch(async err => {
      await logService.addLogToDatabase({
        username: null,
        action: 'refresh_token',
        message: err.response.data.error_description,
        status: err.response.data.error,
        baseUrl: err.config.baseURL,
        url: err.config.url,
      })
      return {
        error: true,
        status: err.response.data.error,
        message: err.response.data.error_description,
      }
    })

  if (res?.error) {
    response.send(res.message)
    return
  }
})

export default router
