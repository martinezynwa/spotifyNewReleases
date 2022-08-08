import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './util/Routes'
import Login from './pages/Login'
import Navbar from './pages/Navbar'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import Releases from './pages/Releases'
import Artists from './pages/Artists'

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/releases" element={<Releases />} />
          </Route>
          <Route path="/" element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
