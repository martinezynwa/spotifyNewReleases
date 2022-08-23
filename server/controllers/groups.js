import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import dayjs from 'dayjs'
const Group = require('../models/Group.cjs')
const Artist = require('../models/Artist.cjs')

const router = express.Router()

//get groups
router.get('/', async (req, res) => {
  const groups = await Group.find({ groupOwner: req.query.userId })
  res.json(groups)
})

//create group
router.post('/', async (req, res) => {
  let { groupName, connectedPlaylist } = req.body.newGroup
  const connectedPlaylistId = connectedPlaylist.split(',')[0]
  const connectedPlaylistName = connectedPlaylist.split(',')[1]

  const groupOwner = req.body.userId

  const createdAt = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')

  const newGroup = new Group({
    groupName,
    connectedPlaylistId,
    connectedPlaylistName,
    groupOwner,
    createdAt,
  })

  const addedGroup = await newGroup.save()
  res.status(201).json(addedGroup)
})

//remove group
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  //deletion of group
  await Group.findOneAndRemove({ _id: id })

  //deletion of asigned artists from the group
  await Artist.deleteMany({ connectedGroupId: id })

  res.status(200).end('Group deleted')
})

//edit group name tbd

export default router
