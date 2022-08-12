import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

const httpLink = `http://localhost:3001/artists`

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

//get artists filtered by group
const getArtistsFromGroups = async id => {
  const { data } = await axios.get(`${httpLink}/group/${id}`)
  return data
}

//get artist from specific group
const checkIfArtistIsInGroup = async id => {
  const { data } = await axios.get(`${httpLink}/${id}`)
  return data
}

//remove artist from group
const removeArtistFromGroup = async id => {
  const response = await axios.delete(`${httpLink}/group/${id}`)
  return response.data
}

const addArtistToGroup = async content => {
  const response = await axios.post(`${httpLink}/group`, content)
  return response
}

const editArtistGroup = async (artistSpotifyId, connectedGroup) => {
  const content = { artistSpotifyId, connectedGroup }
  const response = await axios.put(`${httpLink}/group`, content)
  return response
}

export default {
  getArtistsFromGroups,
  checkIfArtistIsInGroup,
  removeArtistFromGroup,
  addArtistToGroup,
  editArtistGroup,
}
