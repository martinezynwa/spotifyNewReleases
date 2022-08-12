import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import dayjs from 'dayjs'
const Artist = require('../models/Artist.cjs')

const router = express.Router()

//get single artist from database
router.get('/:id', async (req, res) => {
  const artistSpotifyId = req.params.id
  const artist = await Artist.findOne({ artistSpotifyId })
  res.json(artist)
})

//get artists filtered by group
router.get('/group/:id', async (req, res) => {
  const connectedGroupId = req.params.id
  const artists = await Artist.find({ connectedGroupId })
  res.json(artists)
})

//add artist to a group
router.post('/group', async (req, res) => {
  const { artistName, artistSpotifyId, connectedGroup } = req.body.artist

  const connectedGroupId = connectedGroup.split(',')[0]
  const connectedGroupName = connectedGroup.split(',')[1]

  const createdBy = req.body.userId

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
router.put('/group', async (req, res) => {
  const { artistSpotifyId, connectedGroup } = req.body
  const connectedGroupId = connectedGroup.split(',')[0]
  const connectedGroupName = connectedGroup.split(',')[1]
  await Artist.findOneAndUpdate(artistSpotifyId, {
    $set: {
      connectedGroupId: connectedGroupId,
      connectedGroupName: connectedGroupName,
    },
  })
  res.json(connectedGroupName)
})

//remove artist from a group
router.delete('/group/:id', async (req, res) => {
  const artistSpotifyId = req.params.id
  const { _id } = await Artist.findOne({ artistSpotifyId })
  await Artist.findByIdAndRemove({ _id })
  res.status(204).end()
})

export default router
