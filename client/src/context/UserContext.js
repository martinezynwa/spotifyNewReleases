import React, { createContext, useContext, useState, useEffect } from 'react'
import { accessToken } from '../util/spotifyAuth.js'
import userService from '../services/user.js'

//context for groups
const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({})

  useEffect(() => {
    if (accessToken) {
      const getData = async () => {
        await userService.getLoggedUser().then(res => {
          setUser({
            userId: res.id,
            display_name: res.display_name,
          })
        })
      }
      getData()
    }
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
