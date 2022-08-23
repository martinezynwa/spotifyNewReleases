import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
import dayjs from 'dayjs'
import dataService from '../util/songsAndAlbums.js'
import { day30DaysAgo } from '../util/day30DaysAgo.js'
const Release = require('../models/Release.cjs')

const router = express.Router()

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Content-Type'] = 'application/json'

//fetch new releases into playlists
router.get('/all', async (req, res) => {
  const { accessToken, userId } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  let lastFetchDate = '2022-08-24'

  //let { lastFetchDate } = await User.findOne({ id: userId })
  const updatedFetchDate = dayjs(new Date()).format('YYYY-MM-DD')
  lastFetchDate = lastFetchDate.replace(/-/g, '')

  //get albums from artist
  const albums = await dataService.getAlbums(lastFetchDate, userId)

  //get songs from previously loaded albums
  const songs = await dataService.getSongsOfAlbums(albums)

  //assign songs to respective playlists
  await dataService.assignSongsToPlaylists(songs)

  //return what was added
  res.json(albums.sort((a, b) => a.artistName.localeCompare(b.artistName)))
})

//get newly released songs
router.get('/songs', async (req, res) => {
  const { accessToken, album_id } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  const songs = await dataService.getSongs(album_id)
  res.json(songs)
})

//update database with new releases
router.get('/update', async (req, res) => {
  const { accessToken, userId } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  const releases = await dataService.addReleasesToDatabase(userId)
  await Release.deleteMany({ releaseDate: day30DaysAgo })
  res.json(releases)
})

//get new releases from last 30 days saved in database
router.get('/database', async (req, res) => {
  const { userId } = req.query
  const releases = await Release.find({ createdBy: userId })
  res.json(releases)
})

export default router
