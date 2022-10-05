import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import { accessToken } from '../util/spotifyAuth.js'
import userService from '../services/user.js'
import useNotification from '../context/NotificationContext'

//context for groups
const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const { setNotification } = useNotification()

  useEffect(() => {
    if (accessToken && accessToken !== 'test') {
      const getData = async () => {
        await userService
          .getLoggedUser()
          .then(res => {
            setUser({
              userId: res.id,
              display_name: res.display_name,
            })
          })
          .catch(err => {
            console.error(err.message)
            setNotification({
              message: 'err.message',
              style: 'error',
            })
          })
      }
      getData()
    } else {
      setUser({
        userId: process.env.REACT_APP_TEST_USER_ID,
        display_name: process.env.REACT_APP_TEST_USERNAME,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    user: user,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within UserContext')
  }

  return context
}

export default useUser
