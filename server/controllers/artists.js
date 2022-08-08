import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
import dayjs from 'dayjs'
import dataService from '../util/songsAndAlbums.js'
const Artist = require('../models/Artist.cjs')
const Group = require('../models/Group.cjs')

const router = express.Router()

//get single artist
router.get('/:id', async (req, res) => {
  const artistSpotifyId = req.params.id
  const artist = await Artist.findOne({ artistSpotifyId })
  res.json(artist)
})

//remove artist from a group
router.delete('/:id', async (req, res) => {
  const artistSpotifyId = req.params.id
  const { _id } = await Artist.findOne({ artistSpotifyId })
  await Artist.findByIdAndRemove({ _id })
  res.status(204).end()
})

//get artists by group
router.get('/group/:id', async (req, res) => {
  const connectedGroupId = req.params.id
  const artists = await Artist.find({ connectedGroupId })
  res.json(artists)
})

//add artist to a group
router.post('/', async (req, res) => {
  const { artistName, artistSpotifyId, connectedGroup } = req.body

  const connectedGroupId = connectedGroup.split(',')[0]
  const connectedGroupName = connectedGroup.split(',')[1]

  const createdBy = 'martinmgs'

  const createdAt = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')

  const artistData = new Artist({
    artistName,
    artistSpotifyId,
    connectedGroupId,
    connectedGroupName,
    createdBy,
    createdAt,
  })
  const artistAdded = await artistData.save()
  res.status(201).json(artistAdded)
})

//edit artist's group
router.put('/', async (req, res) => {
  const { _id, connectedGroup } = req.body
  const connectedGroupId = connectedGroup.split(',')[0]
  const connectedGroupName = connectedGroup.split(',')[1]
  const updatedArtist = await Artist.findByIdAndUpdate(_id, {
    $set: {
      connectedGroupId: connectedGroupId,
      connectedGroupName: connectedGroupName,
    },
  })
  res.json(updatedArtist)
})

//get new releases by artist
router.post('/releases', async (req, res) => {
  //get artists from groups
  const { accessToken } = req.body
  axios.defaults.baseURL = 'https://api.spotify.com/v1'
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
  axios.defaults.headers['Content-Type'] = 'application/json'

  const artists = await Artist.find({})

  let lastFetchDate = '2022-07-01'
  lastFetchDate = lastFetchDate.replace(/-/g, '')
  //get albums from artist
  const getAlbums = async () => {
    let artistsArray = []
    let singleArtist
    for (let artist of artists) {
      let { data } = await axios.get(
        `/artists/${artist.artistSpotifyId}/albums?include_groups=album%2Csingle&limit=50`,
      )
      data.items = data.items.filter(
        a => a.release_date.replace(/-/g, '') >= lastFetchDate,
      )
      data.items.map(a => {
        if (a.artists.length > 1) {
          singleArtist = a.artists.filter(a => a.id === artist.artistSpotifyId)
          singleArtist = singleArtist[0]
        } else {
          singleArtist = a.artists[0]
        }

        const obj = {
          album_id: a.id,
          album_name: a.name,
          release_date: a.release_date,
          artist_id: singleArtist.id,
          artist_name: singleArtist.name,
        }
        artistsArray.push(obj)
      })
    }
    return artistsArray
  }

  const albums = await getAlbums()

  const getSongs = async () => {
    let songsArray = []
    for (let a of albums) {
      const { data } = await axios.get(`/albums/${a.album_id}/tracks?limit=50`)
      data.items.map(s => {
        const obj = {
          song_id: s.id,
          song_name: s.name,
          artist_id: a.artist_id,
          artist_name: a.artist_name,
        }
        songsArray.push(obj)
      })
    }
    const ids = songsArray.map(s => s.song_id)
    const filtered = songsArray.filter(
      ({ song_id }, index) => !ids.includes(song_id, index + 1),
    )
    return filtered
  }
  const songs = await getSongs()

  const assignSongsToPlaylists = async () => {
    for (let s of songs) {
      const { connectedGroupId } = await Artist.findOne({
        artistSpotifyId: s.artist_id,
      })
      const { connectedPlaylistId } = await Group.findOne({
        _id: connectedGroupId,
      })
      const response = await axios.post(
        `/playlists/${connectedPlaylistId}/tracks?uris=spotify%3Atrack%3A${s.song_id}`,
      )
    }
    return 'success'
  }
  const test = await assignSongsToPlaylists()
  res.json('ok')
})

router.post('/releases/albums', async (req, res) => {
  const { accessToken } = req.body
  axios.defaults.baseURL = 'https://api.spotify.com/v1'
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
  axios.defaults.headers['Content-Type'] = 'application/json'

  const artists = await Artist.find({})
  const albums = await dataService.getAlbums(artists)
  res.json(albums)
})

router.post('/releases/songs', async (req, res) => {
  const { accessToken, album_id } = req.body
  axios.defaults.baseURL = 'https://api.spotify.com/v1'
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
  axios.defaults.headers['Content-Type'] = 'application/json'

  const songs = await dataService.getSongs(album_id)
  res.json(songs)
})

export default router
