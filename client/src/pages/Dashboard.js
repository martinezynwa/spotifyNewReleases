import LoadReleases from '../components/Dashboard/LoadReleases.js'
import AddedReleases from '../components/Dashboard/AddedReleases.js'
import { ReleaseProvider } from '../context/ReleaseContext.js'

const Dashboard = () => {
  return (
    <>
      <ReleaseProvider>
        <LoadReleases />
        <AddedReleases />
      </ReleaseProvider>
    </>
  )
}

export default Dashboard
