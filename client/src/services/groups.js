import axios from 'axios'

const getGroups = async () => {
  const response = await axios.get('http://localhost:3001/groups')
  return response.data
}

const createGroup = async content => {
  const response = await axios.post('http://localhost:3001/groups', content)
  return response.data
}

const getArtistsFromGroups = async id => {
  const { data } = await axios.get(`http://localhost:3001/artists/group/${id}`)
  return data
}

const checkIfArtistIsInGroup = async id => {
  const { data } = await axios.get(`http://localhost:3001/artists/${id}`)
  return data
}

const removeArtistFromGroup = async id => {
  console.log('id', id)
  const response = await axios.delete(`http://localhost:3001/artists/${id}`)
  return response.data
}

export default {
  createGroup,
  getGroups,
  getArtistsFromGroups,
  checkIfArtistIsInGroup,
  removeArtistFromGroup,
}
