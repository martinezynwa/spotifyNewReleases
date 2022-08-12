import { Outlet, Navigate } from 'react-router-dom'
import { accessToken } from './spotifyAuth.js'

//private routes are allowed for logged users
const PrivateRoute = () => {
  return accessToken ? <Outlet /> : <Navigate to="/login" />
}

//public route for anyone, only login page is displayed and nothing else can be accessed
const PublicRoute = () => {
  return accessToken ? <Navigate to="/" /> : <Outlet />
}

export { PrivateRoute, PublicRoute }
