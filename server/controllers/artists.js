import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
const Artist = require('../models/Artist.cjs')

const router = express.Router()

//get artists from database
router.get('/', async (request, response) => {
  const { createdBy, skip } = request.query
  const artists = await Artist.find({ createdBy })
    .collation({ locale: 'en' })
    .sort({ connectedGroupName: 1 })
    .skip(skip ? skip : 0)
    .limit(20)

  //returning sorted artists
  response.json(artists)
})

//get artists filtered by group
router.get('/group/:id', async (request, response) => {
  const connectedGroupId = request.params.id
  const artists = await Artist.find({ connectedGroupId })

  //returning filtered artists
  response.json(artists)
})

//change artist's group
router.put('/group', async (request, response) => {
  const { _id, connectedGroup } = request.body
  const connectedGroupId = connectedGroup.split(',')[0]
  const connectedGroupName = connectedGroup.split(',')[1]

  //when removing artist from group
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
    //removed from group
    return response.json('Removed')
  }

  //changing artist's group
  await Artist.findOneAndUpdate(
    { _id },
    {
      $set: {
        connectedGroupId: connectedGroupId,
        connectedGroupName: connectedGroupName,
      },
    },
  )

  //returning changed group
  response.json(connectedGroup.split(',')[1])
})

export default router
