import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

const httpLink = `${process.env.REACT_APP_SERVER_URI}/releases`

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

const getReleasedSongs = async (accessToken, album_id) => {
  const { data } = await axios.get(`${httpLink}/songs`, {
    params: {
      accessToken,
      album_id,
    },
  })
  return data
}

const updateDatabaseWithReleases = async userId => {
  const { data } = await axios.get(`${httpLink}/update`, {
    params: {
      accessToken,
      userId,
    },
  })
  return data
}

const getReleasesFromLast60Days = async (userId, skip) => {
  const { data } = await axios.get(`${httpLink}/database`, {
    params: {
      userId,
      skip,
    },
  })
  return data
}

export default {
  getReleasedSongs,
  updateDatabaseWithReleases,
  getReleasesFromLast60Days,
}
