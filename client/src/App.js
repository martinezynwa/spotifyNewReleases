import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './util/Routes'
import Notification from './components/Notification/Notification'
import Login from './pages/Login'
import Navbar from './pages/Navbar'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import Group from './pages/Group'
import Releases from './pages/Releases'
import Release from './pages/Release'
import Search from './pages/Search'
import Options from './pages/Options'
import { NotificationProvider } from './context/NotificationContext.js'
import { UserProvider } from './context/UserContext.js'
import { accessToken } from './util/spotifyAuth.js'
import './style.css'

const App = () => {
  return (
    <>
      <Router>
        <NotificationProvider>
          <UserProvider>
            <div className="flex flex-col h-full relative md:flex md:flex-row">
              <Notification />
              <Navbar />
              <div
                className={`flex-grow ml-0 ${
                  accessToken ? 'md:ml-72' : 'md:ml-0'
                }`}>
                <Routes>
                  <Route path="/" element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/groups/:id" element={<Group />} />
                    <Route path="/releases" element={<Releases />} />
                    <Route path="/releases/:id" element={<Release />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/options" element={<Options />} />
                  </Route>
                  <Route path="/" element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </UserProvider>
        </NotificationProvider>
      </Router>
    </>
  )
}

export default App
