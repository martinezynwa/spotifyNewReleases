import React, {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import { accessToken } from '../util/spotifyAuth.js'
import userReducer from '../reducers/userReducer'
import userService from '../services/user.js'

//context for groups
const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, [])

  const [user, setUser] = useState([])

  useEffect(() => {
    if (accessToken) {
      const getData = async () => {
        await userService.getLoggedUser().then(res => {
          setUser(res)
        })
      }
      getData()
    }
  }, [])

  useEffect(() => {
    dispatch({
      type: 'USER',
      user,
    })
  }, [user])

  const value = {
    user: state.user,
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
