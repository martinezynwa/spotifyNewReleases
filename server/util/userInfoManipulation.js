import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import dayjs from 'dayjs'

const User = require('../models/User.cjs')

//update last fetch date
const updateFetchDate = async userId => {
  const today = dayjs(new Date()).format('YYYY-MM-DD')
  await User.findOneAndUpdate(
    { spotify_id: userId },
    {
      $set: {
        lastFetchDate: today,
      },
    },
  )

  return
}

/*update if new artists were followed during run
  or if new albums were added during run
  needed for jobs in order to understandthat no new artists 
  were added and specific job does not have to run for no reason
*/
const updateFetchValues = async (type, updateValue, userId) => {
  await User.findOneAndUpdate(
    { spotify_id: userId },
    {
      $set: {
        [type]: updateValue,
      },
    },
  )
  return
}

export default {
  updateFetchDate,
  updateFetchValues,
}
