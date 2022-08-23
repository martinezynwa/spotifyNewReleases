import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import dayjs from 'dayjs'
const Artist = require('../models/Artist.cjs')

const router = express.Router()

//get artists from database
router.get('/', async (req, res) => {
  const { createdBy } = req.query
  const artists = await Artist.find({ createdBy })
  res.json(
    artists
      .sort((a, b) => a.artistName.localeCompare(b.artistName))
      .sort((a, b) => {
        a = a.connectedGroupName || ''
        b = b.connectedGroupName || ''
        return b.localeCompare(a)
      }),
  )
})

//get artists filtered by group
router.get('/group/:id', async (req, res) => {
  const connectedGroupId = req.params.id
  const artists = await Artist.find({ connectedGroupId })
  res.json(artists)
})

//change artist's group
router.put('/group', async (req, res) => {
  const { _id, connectedGroup } = req.body
  const connectedGroupId = connectedGroup.split(',')[0]
  const connectedGroupName = connectedGroup.split(',')[1]

  if (connectedGroup === 'Not added') {
    await Artist.findOneAndUpdate(
      { _id },
      {
        $set: {
          connectedGroupId: null,
          connectedGroupName: null,
        },
      },
    )
    return 'Removed'
  }

  await Artist.findOneAndUpdate(
    { _id },
    {
      $set: {
        connectedGroupId: connectedGroupId,
        connectedGroupName: connectedGroupName,
      },
    },
  )

  res.json(connectedGroup.split(',')[1])
})

export default router
