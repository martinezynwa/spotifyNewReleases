import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { accessToken } from '../util/spotifyAuth.js'
import { logout } from '../util/spotifyAuth.js'
import '../style.css'
import logo from '../assets/img/logo.svg'
import menu from '../assets/img/menu.svg'

import Icon from '../util/Icons'

const Navbar = () => {
  const [mobileNavbar, setMobileNavbar] = useState(false)

  const activeLink =
    'flex h-10 gap-x-4 items-center text-sm font-semibold text-white hover:text-white px-4 py-8 md:py-5 mx-2 rounded bg-active'
  const inactiveLink =
    'flex h-10 gap-x-4 items-center text-sm font-semibold text-link hover:text-white px-4 mx-2 rounded'

  const toggleNavbar = () => {
    setMobileNavbar(!mobileNavbar)
  }

  const navbar = !accessToken ? null : (
    <>
      <div
        className={`${
          !mobileNavbar
            ? 'flex flex-row justify-between ml-4 mt-4 text-gray-100 md:hidden'
            : ' '
        }`}>
        <NavLink to="/">
          <img
            src={logo}
            alt=""
            className={`${!mobileNavbar ? 'h-12 my-4' : 'h-12 my-4 ml-4 mt-8'}`}
          />
        </NavLink>
        <button
          className={!mobileNavbar ? 'mr-6' : 'hidden'}
          onClick={() => toggleNavbar()}>
          <img src={menu} alt="" />
        </button>
      </div>

      <aside
        className={`${
          !mobileNavbar ? 'w-0 ' : 'w-full '
        }fixed h-full bg-black duration-75 ease-in-out md:w-72 md:left-0 md:top-0`}>
        <NavLink to="/">
          <img
            src={logo}
            alt=""
            className="hidden md:flex md:h-10 md:ml-5 md:my-8 md:mr-[140px]"
          />
        </NavLink>

        <nav
          className={`md:px-2 md:space-y-2 md:flex md:flex-col ${
            !mobileNavbar ? ' hidden' : 'mt-10 space-y-6'
          }`}>
          <NavLink
            onClick={mobileNavbar ? () => toggleNavbar() : ''}
            to="/"
            className={({ isActive }) =>
              isActive ? activeLink : inactiveLink
            }>
            <span>
              <Icon
                name="Home"
                size={`${mobileNavbar ? 'mobile' : 'desktop'}`}
              />
            </span>
            <p>Dashboard</p>
          </NavLink>
          <NavLink
            onClick={mobileNavbar ? () => toggleNavbar() : ''}
            to="/releases"
            className={({ isActive }) =>
              isActive ? activeLink : inactiveLink
            }>
            <span>
              <Icon
                name="Releases"
                size={`${mobileNavbar ? 'mobile' : 'desktop'}`}
              />
            </span>
            <p>Releases</p>
          </NavLink>
          <NavLink
            onClick={mobileNavbar ? () => toggleNavbar() : ''}
            to="/groups"
            className={({ isActive }) =>
              isActive ? activeLink : inactiveLink
            }>
            <span>
              <Icon
                name="Groups"
                size={`${mobileNavbar ? 'mobile' : 'desktop'}`}
              />
            </span>
            <p>Groups</p>
          </NavLink>

          <NavLink
            onClick={mobileNavbar ? () => toggleNavbar() : ''}
            to="/options"
            className={({ isActive }) =>
              isActive ? activeLink : inactiveLink
            }>
            <span>
              <Icon
                name="Options"
                size={`${mobileNavbar ? 'mobile' : 'desktop'}`}
              />
            </span>
            <p>Options</p>
          </NavLink>
          <button onClick={logout} className={inactiveLink}>
            <span>
              <Icon
                name="Logout"
                size={`${mobileNavbar ? 'mobile' : 'desktop'}`}
              />
            </span>
            <p>Log Out</p>
          </button>
        </nav>
      </aside>
    </>
  )
  return navbar
}

export default Navbar
