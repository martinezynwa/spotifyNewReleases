import { useState, useEffect } from 'react'
import { accessToken } from '../../util/spotifyAuth.js'
import userService from '../../services/user.js'

const LoggedUser = () => {
  const [loggedUser, setLoggedUser] = useState('')

  useEffect(() => {
    if (accessToken) {
      const getData = async () => {
        await userService.getLoggedUser().then(res => {
          setLoggedUser(res)
        })
      }
      getData()
    }
  }, [])

  return loggedUser
}

export default LoggedUser
