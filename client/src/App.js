import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './util/Routes'
import Notification from './components/Notification/Notification'
import Login from './pages/Login'
import Navbar from './pages/Navbar'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import Artists from './pages/Artists'
import Releases from './pages/Releases'
import Search from './pages/Search'
import Options from './pages/Options'
import { NotificationProvider } from './context/NotificationContext.js'
import { UserProvider } from './context/UserContext.js'
import './style.css'

const App = () => {
  return (
    <>
      <Router>
        <NotificationProvider>
          <UserProvider>
            <div class="wrapper">
              <Notification />
              <Navbar />
              <Routes>
                <Route path="/" element={<PrivateRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/releases" element={<Releases />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/options" element={<Options />} />
                </Route>
                <Route path="/" element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
            </div>
          </UserProvider>
        </NotificationProvider>
      </Router>
    </>
  )
}

export default App
