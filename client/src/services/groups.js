import axios from 'axios'
const httpLink = `http://localhost:3001/groups`

//get groups
const getGroups = async userId => {
  const response = await axios.get(`${httpLink}`, {
    params: {
      userId,
    },
  })
  return response.data
}

//create group
const createGroup = async content => {
  const response = await axios.post(`${httpLink}`, content)
  return response.data
}

//remove group tbd
const removeGroup = async id => {
  const response = await axios.delete(`${httpLink}/${id}`)
  return response.data
}

//edit group name tbd

export default {
  getGroups,
  createGroup,
  removeGroup,
}
