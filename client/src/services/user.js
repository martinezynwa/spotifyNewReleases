import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

const getLoggedUser = async () => {
  const { data } = await axios.get('/me')
  return data
}

const getUsersPlaylists = async () => {
  const { data } = await axios.get('/me/playlists')
  return data.items
}

export default { getLoggedUser, getUsersPlaylists }
