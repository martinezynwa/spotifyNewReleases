import axios from 'axios'
const httpLink = `${process.env.REACT_APP_SERVER_URI}/artists`

//get artists from database
const getArtistsFromDatabase = async (createdBy, skip) => {
  const { data } = await axios
    .get(httpLink, {
      params: {
        createdBy,
        skip,
      },
    })
    .catch(err => {
      console.log(err.response.data)
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
