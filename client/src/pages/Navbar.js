import { NavLink } from 'react-router-dom'
import { accessToken } from '../util/spotifyAuth.js'
import { logout } from '../util/spotifyAuth.js'
import LoggedUser from '../components/Navbar/LoggedUser.js'
import '../styles/pages/Navbar.css'

const Navbar = () => {
  const navbar = !accessToken ? null : (
    <>
      <div className="nav-header">
        <h2>{<LoggedUser /> ?? null}</h2>
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
        <button onClick={logout}>Log Out</button>
      </div>
    </>
  )
  return navbar
}

export default Navbar
