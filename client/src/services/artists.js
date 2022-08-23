import axios from 'axios'
const httpLink = `http://localhost:3001/artists`

//get artists from database
const getArtistsFromDatabase = async createdBy => {
  const { data } = await axios.get(httpLink, {
    params: {
      createdBy,
    },
  })
  return data
}

//get artists filtered by group
const getArtistsFromGroups = async id => {
  const { data } = await axios.get(`${httpLink}/group/${id}`)
  return data
}

//assign artist to a group
const addArtistToGroup = async content => {
  const { data } = await axios.put(`${httpLink}/group`, content)
  return data
}

export default {
  getArtistsFromDatabase,
  getArtistsFromGroups,
  addArtistToGroup,
}
