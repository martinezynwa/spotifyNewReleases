import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

const getLoggedUser = async () => {
  const response = await axios.get('/me')
  return response.data.display_name
}

export default { getLoggedUser }
