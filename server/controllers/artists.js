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
    //.sort({ connectedGroupName: 1 })
    .skip(skip ? skip : 0)
    .limit(40)

  //returning sorted artists
  response.json(artists)
})

//get artists filtered by group
router.get('/group/:id', async (request, response) => {
  const connectedGroupId = request.params.id
  const { createdBy } = request.query

  connectedGroupId === 'undefined'
    ? response.json(await Artist.find({ createdBy, connectedGroupId: null }))
    : response.json(await Artist.find({ connectedGroupId }))
})

//manipulate with artist's group
router.put('/group', async (request, response) => {
  const { type, newGroup, _id } = request.body

  //removing artist from group
  if (type === 'remove') {
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

  const { groupId, groupName } = newGroup

  //adding to group or changing artist's group
  await Artist.findOneAndUpdate(
    { _id },
    {
      $set: {
        connectedGroupId: groupId,
        connectedGroupName: groupName,
      },
    },
  )

  //returning changed group
  response.json(newGroup.groupName)
})

export default router
