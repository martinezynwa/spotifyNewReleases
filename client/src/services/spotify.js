import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

const httpLink = `http://localhost:3001/spotify`

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

const syncFollowedArtists = async userId => {
  if (!userId) {
    return null
  }

  const { data } = await axios.get(`${httpLink}/sync`, {
    params: {
      accessToken,
      userId,
    },
  })
  return data
}

const removeUnfollowed = async userId => {
  const { data } = await axios.get(`${httpLink}/remove`, {
    params: {
      accessToken,
      userId,
    },
  })
  return data
}

export default {
  syncFollowedArtists,
  removeUnfollowed,
}
