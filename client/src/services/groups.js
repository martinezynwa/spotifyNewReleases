import axios from 'axios'
const httpLink = `${process.env.REACT_APP_SERVER_URI}/groups`

//get groups
const getGroups = async userId => {
  const { data } = await axios.get(`${httpLink}`, {
    params: {
      userId,
    },
  })
  return data
}

//create group
const createGroup = async content => {
  const { data } = await axios.post(`${httpLink}`, content)
  return data
}

//remove group tbd
const removeGroup = async id => {
  const { data } = await axios.delete(`${httpLink}/${id}`)
  return data
}

//edit group name tbd

export default {
  getGroups,
  createGroup,
  removeGroup,
}
