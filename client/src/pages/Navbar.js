import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { accessToken } from '../util/spotifyAuth.js'
import { logout } from '../util/spotifyAuth.js'
import userService from '../services/user.js'

const Navbar = () => {
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

  const navbar = !accessToken ? null : (
    <>
      <div>
        <h2>{loggedUser ?? null}</h2>
        <NavLink to="/">
          <h3>Dashboard</h3>
        </NavLink>
        <NavLink to="/groups">
          <h3>Groups</h3>
        </NavLink>
        <NavLink to="/releases">
          <h3>Releases</h3>
        </NavLink>
        <NavLink to="/artists">
          <h3>Artists</h3>
        </NavLink>
        <button onClick={logout}>Log Out</button>
      </div>
    </>
  )
  return navbar
}

export default Navbar
