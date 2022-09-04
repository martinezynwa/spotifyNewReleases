import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
const router = express.Router()

const Log = require('../models/Log.cjs')

//get logs from database
router.get('/', async (request, response) => {
  const { userId } = request.query
  const logs = await Log.find({ username: userId })

  response.json(logs)
})

export default router
