import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
const router = express.Router()

import dataService from '../util/dataService.js'
import logService from '../util/logService.js'
import demoService from '../util/demoService.js'
import { day60DaysAgo } from '../util/day60DaysAgo.js'

const Release = require('../models/Release.cjs')

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Content-Type'] = 'application/json'

//get newly released songs
router.get('/songs', async (request, response) => {
  let { accessToken, album_id } = request.query

  if (accessToken === 'test') {
    accessToken = await demoService.demoGetToken()
  }

  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  const songs = await dataService.getSongs(album_id)
  if (songs.error) {
    return response.status(songs.status).json(songs.message)
  }

  response.json(songs)
})

//update database with new releases
router.get('/update', async (request, response) => {
  const { accessToken, userId } = request.query

  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  await logService.addLogToDatabase({
    username: userId,
    action: 'releases/update',
    message: 'Started updating database',
  })

  //add new releases to database
  const releases = await dataService.addReleasesToDatabase(userId)
  if (releases.error) {
    return response.status(releases.status).json(releases.message)
  }

  //remove releases older than 60 days from database
  await Release.deleteMany({ releaseDate: { $lt: day60DaysAgo } })
  response.json(releases)
})

//get new releases from last 60 days saved in database
router.get('/database', async (request, response) => {
  const { userId, skip } = request.query
  const releases = await Release.find({ createdBy: userId })
    .skip(skip ? skip : 0)
    .sort({ releaseDate: -1, artistName: 1 })
    .limit(30)
  response.json(releases)
})

export default router
