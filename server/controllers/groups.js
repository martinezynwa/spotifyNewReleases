import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import axios from 'axios'
import dayjs from 'dayjs'
const Group = require('../models/Group.cjs')

const router = express.Router()

//get group
router.get('/', async (req, res) => {
  const groups = await Group.find({})
  res.json(groups)
})

//create group
router.post('/', async (req, res) => {
  let { groupName, connectedPlaylist } = req.body

  const connectedPlaylistId = connectedPlaylist.split(',')[0]
  const connectedPlaylistName = connectedPlaylist.split(',')[1]

  const groupOwner = 'martinmgs'

  const createdAt = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')

  const newGroup = new Group({
    groupName,
    connectedPlaylistId,
    connectedPlaylistName,
    groupOwner,
    createdAt,
  })

  const addedGroup = await newGroup.save()
  console.log('addedGroup', addedGroup)
  res.status(201).json(addedGroup)
})

export default router
