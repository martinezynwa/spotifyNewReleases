import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
import dayjs from 'dayjs'
import dataService from '../util/songsAndAlbums.js'
const Artist = require('../models/Artist.cjs')
const Group = require('../models/Group.cjs')
const User = require('../models/User.cjs')

const router = express.Router()

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Content-Type'] = 'application/json'

//get new releases by artist
router.get('/all', async (req, res) => {
  const { accessToken, userId } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
  const artists = await Artist.find({})

  let { lastFetchDate } = await User.findOne({ id: userId })
  const updatedFetchDate = dayjs(new Date()).format('YYYY-MM-DD')
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

        artistsArray.push({
          album_id: a.id,
          artist_id: singleArtist.id,
          album_name: a.name,
          release_type: a.album_type,
          release_date: a.release_date,
          artist_name: singleArtist.name,
        })
      })
    }
    return artistsArray
  }

  const albums = await getAlbums()

  const getSongs = async () => {
    let songsArray = []
    for (let a of albums) {
      const { data } = await axios.get(`/albums/${a.album_id}/tracks?limit=50`)
      const { connectedGroupId } = await Artist.findOne({
        artistSpotifyId: a.artist_id,
      })
      const { connectedPlaylistId } = await Group.findOne({
        _id: connectedGroupId,
      })
      data.items.map(s => {
        songsArray.push({
          song_id: s.id,
          connectedPlaylistId,
        })
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
    const groupedByPlaylist = songs.reduce((obj, song) => {
      const key = song.connectedPlaylistId
      if (obj[key] == null) obj[key] = []

      obj[key].push(`spotify%3Atrack%3A${song.song_id}`)
      return obj
    }, {})

    for (let [playlistId, songsByPlaylist] of Object.entries(
      groupedByPlaylist,
    )) {
      const songs = songsByPlaylist.join('%2C')
      const response = await axios.post(
        `/playlists/${playlistId}/tracks?uris=${songs}`,
      )
    }
  }

  //await assignSongsToPlaylists()
  res.json(albums.sort((a, b) => a.artist_name.localeCompare(b.artist_name)))
})

//get newly released albums
router.get('/albums', async (req, res) => {
  const { accessToken } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  const artists = await Artist.find({})
  const albums = await dataService.getAlbums(artists)
  res.json(albums)
})

//get newly released songs
router.get('/songs', async (req, res) => {
  const { accessToken, album_id } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  const songs = await dataService.getSongs(album_id)
  res.json(songs)
})

export default router
