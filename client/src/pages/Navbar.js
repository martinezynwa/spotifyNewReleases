import { NavLink } from 'react-router-dom'
import { accessToken } from '../util/spotifyAuth.js'
import { logout } from '../util/spotifyAuth.js'
import useUser from '../context/UserContext'
import '../style.css'

const Navbar = () => {
  const { user } = useUser()

  const navbar = !accessToken ? null : (
    <>
      <aside className='w-60'>
        <h2>{user ? user.display_name : null}</h2>
        <NavLink to="/">
          <h3>Dashboard</h3>
        </NavLink>
        <NavLink to="/groups">
          <h3>Groups</h3>
        </NavLink>
        <NavLink to="/artists">
          <h3>Artists</h3>
        </NavLink>
        <NavLink to="/releases">
          <h3>Releases</h3>
        </NavLink>
        <NavLink to="/search">
          <h3>Search</h3>
        </NavLink>
        <NavLink to="/options">
          <h3>Options</h3>
        </NavLink>
        <button onClick={logout}>Log Out</button>
      </aside>
    </>
  )
  return navbar
}

export default Navbar
