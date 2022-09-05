import LoadReleases from '../components/Dashboard/LoadReleases.js'
import AddedReleases from '../components/Dashboard/AddedReleases.js'
import { ReleaseProvider } from '../context/ReleaseContext.js'

const Dashboard = () => {
  return (
    <div class='content'>
      <ReleaseProvider>
        <LoadReleases />
        <AddedReleases />
      </ReleaseProvider>
    </div>
  )
}

export default Dashboard
