import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
const Artist = require('../models/Artist.cjs')

const router = express.Router()

//get followed artists
router.get('/', async (req, res) => {
  const { accessToken } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  let artistsArray = []
  let nextToken = ''

  const getItems = async nextToken => {
    let res = []

    if (!nextToken) {
      res = await axios.get('/me/following?type=artist&limit=50')
    } else {
      res = await axios.get(nextToken)
    }

    const { items } = res.data.artists
    for (let i of items) {
      const group = await Artist.findOne({ artistSpotifyId: i.id })
      artistsArray.push({
        id: i.id,
        name: i.name,
        connectedGroupId: group ? group.connectedGroupId : null,
        connectedGroupName: group ? group.connectedGroupName : null,
      })
    }
    return res.data.artists.next
  }

  nextToken = await getItems()

  while (nextToken !== null) {
    nextToken = await getItems(nextToken)
  }

  artistsArray.sort((a, b) => a.name.localeCompare(b.name))

  res.json(artistsArray)
})

//unfollow artist from Spotify
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { accessToken } = req.query
  axios.defaults.baseURL = 'https://api.spotify.com/v1'
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
  axios.defaults.headers['Content-Type'] = 'application/json'

  //unfollow from spotify
  await axios.delete(`/me/following?type=artist&ids=${id}`)
  //deletion from group
  await Artist.findOneAndRemove({ artistSpotifyId: id })
  res.status(200).end('Artist unfollowed')
})

export default router
