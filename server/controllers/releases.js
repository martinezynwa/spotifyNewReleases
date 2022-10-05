import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
const router = express.Router()

import dataService from '../util/songsAndAlbums.js'
import logService from '../util/logger.js'
import userInfoService from '../util/userInfoManipulation.js'
import demoService from '../util/demoUtil.js'
import { day60DaysAgo } from '../util/day60DaysAgo.js'

const Release = require('../models/Release.cjs')
const User = require('../models/User.cjs')

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

  //log addition
  await logService.addLogToDatabase({
    username: userId,
    action: 'releases/all-albums',
    message: `Added ${albums.length !== 0 ? albums.length : '0'} new albums`,
  })

  //if no new albums, it's pointless to get songs
  if (albums.length > 0) {
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

    //log addition
    await logService.addLogToDatabase({
      username: userId,
      action: 'releases/all-songs',
      message: `Added ${songs.length !== 0 ? songs.length : '0'} new songs`,
    })
  }

  await userInfoService.updateFetchValues(
    'lastFetchNewAlbumsAdded',
    albums.length > 0 ? true : false,
    userId,
  )

  //update last fetch date in user's profile
  await userInfoService.updateFetchDate(userId)

  response.json(albums.sort((a, b) => a.artistName.localeCompare(b.artistName)))
})

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

//change scheduler date
router.put('/scheduler', async (request, response) => {
  const { userId, schedule } = request.body.params

  await userInfoService.updateCustomSchedule(schedule, userId)

  response.json('set')
})

export default router
