import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
import dayjs from 'dayjs'
import dataService from '../util/songsAndAlbums.js'
import { day30DaysAgo } from '../util/day30DaysAgo.js'
import jobs from '../util/jobs.js'

const Release = require('../models/Release.cjs')
const User = require('../models/User.cjs')

const router = express.Router()

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Content-Type'] = 'application/json'

//fetch new releases into playlists
router.get('/all', async (request, response) => {
  const { accessToken, userId } = request.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  //get last fetch date that should be used in getting items
  let { lastFetchDate } = await User.findOne({ spotify_id: userId })
  lastFetchDate = lastFetchDate.replace(/-/g, '')

  //get albums from artist
  const albums = await dataService.getAlbums(lastFetchDate, userId)
  if (albums?.error) {
    return response.status(albums.status).json(albums.message)
  }

  //get songs from previously loaded albums
  const songs = await dataService.getSongsOfAlbums(albums, userId)
  if (songs?.error) {
    return response.status(songs.status).json(songs.message)
  }

  //assign songs to respective playlists
  const assigned = await dataService.assignSongsToPlaylists(songs, userId)
  if (assigned?.error) {
    return response.status(assigned.status).json(assigned.message)
  }

  //update last fetch date in user's profile
  const updatedFetchDate = dayjs(new Date()).format('YYYY-MM-DD')

  await User.findOneAndUpdate(
    { spotify_id: userId },
    {
      $set: {
        lastFetchDate: updatedFetchDate,
      },
    },
  )
  //return what was added
  response.json(albums.sort((a, b) => a.artistName.localeCompare(b.artistName)))
})

//get newly released songs
router.get('/songs', async (request, response) => {
  const { accessToken, album_id } = request.query
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

  const releases = await dataService.addReleasesToDatabase(userId)
  if (releases.error) {
    return response.status(releases.status).json(releases.message)
  }
  await Release.deleteMany({ releaseDate: { $lt: day30DaysAgo } })
  response.json(releases)
})

//get new releases from last 30 days saved in database
router.get('/database', async (request, response) => {
  const { userId, skip } = request.query

  const releases = await Release.find({ createdBy: userId })
    .sort({ releaseDate: -1 })
    .skip(skip ? skip : 0)
    .limit(30)
  response.json(releases)
})

//change scheduler
router.put('/scheduler', async (request, response) => {
  const { userId, schedule } = request.body.params

  await User.findOneAndUpdate(
    { spotify_id: userId },
    {
      $set: {
        customSchedule: schedule,
      },
    },
  )
  jobs.runJobs()
  response.json('set')
})

export default router
