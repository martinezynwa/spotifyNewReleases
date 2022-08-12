import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

const httpLink = `http://localhost:3001/releases`

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

const getNewReleases = async (accessToken, userId) => {
  const response = await axios.get(`${httpLink}/all`, {
    params: {
      accessToken,
      userId
    },
  })
  return response
}

const getReleasedAlbums = async accessToken => {
  const response = await axios.get(`${httpLink}/albums`, {
    params: {
      accessToken,
    },
  })
  return response
}

const getReleasedSongs = async (accessToken, album_id) => {
  const response = await axios.get(`${httpLink}/songs`, {
    params: {
      accessToken,
      album_id,
    },
  })
  return response
}

export default {
  getNewReleases,
  getReleasedAlbums,
  getReleasedSongs,
}
