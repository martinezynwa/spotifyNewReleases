import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import dayjs from 'dayjs'

const User = require('../models/User.cjs')

//update last fetch date
const updateFetchDate = async userId => {
  const today = dayjs(new Date()).format('YYYY-MM-DD')

  return await User.findOneAndUpdate(
    { spotify_id: userId },
    {
      $set: {
        lastFetchDate: today,
      },
    },
  )
}

export default {
  updateFetchDate,
}
