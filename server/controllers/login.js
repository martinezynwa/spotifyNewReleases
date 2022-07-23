import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import axios from 'axios'
import { loginUrl } from '../util/loginUrl.js'
import dayjs from 'dayjs'
const User = require('../models/User.cjs')

const router = express.Router()

router.get('/login', async (req, res) => {
  res.redirect(loginUrl)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code || null
  let display_name = ''
  let id = ''

  await axios({
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
    .then(async response => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data

        //get user data
        await axios
          .get('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: 'Bearer ' + access_token,
            },
          })
          .then(res => {
            ;({ display_name, id } = res.data)
          })
          .catch(err => {
            res.send(err)
          })

        //check if user exists in mongoDB
        const user = await User.findOne({ spotify_id: id })
        if (!user) {
          //add user into database if not there already
          const newUser = new User({
            spotify_id: id,
            spotify_name: display_name,
            registeredAt: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
          })
          await newUser.save()
        }

        const queryParams = new URLSearchParams({
          access_token,
          refresh_token,
          expires_in,
        })
        res.redirect(`http://localhost:3000/?${queryParams}`)
      } else {
        res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`)
      }
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query

  await axios({
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
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.send(error)
    })
})

export default router
