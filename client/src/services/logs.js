import axios from 'axios'
const httpLink = `${process.env.REACT_APP_SERVER_URI}/logs`

const getLogs = async userId => {
  const { data } = await axios.get(`${httpLink}`, {
    params: {
      userId,
    },
  })

  return data
}

export default {
  getLogs,
}
