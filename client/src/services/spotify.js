import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

const httpLink = `http://localhost:3001/spotify`

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

const getFollowedArtists = async () => {
  const { data } = await axios.get(httpLink, {
    params: {
      accessToken,
    },
  })
  return data
}

const unfollowArtist = async content => {
  const { id, accessToken } = content
  const response = await axios.delete(`${httpLink}/${id}`, {
    params: {
      accessToken,
    },
  })
  return response.data
}

export default {
  getFollowedArtists,
  unfollowArtist,
}
