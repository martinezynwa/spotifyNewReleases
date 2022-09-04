import axios from 'axios'
const httpLink = `http://localhost:3001/logs`

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
