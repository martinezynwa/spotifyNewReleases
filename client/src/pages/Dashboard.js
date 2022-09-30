import LoadReleases from '../components/Dashboard/LoadReleases.js'
import AddedReleases from '../components/Dashboard/AddedReleases.js'
import { ReleaseProvider } from '../context/ReleaseContext.js'

const Dashboard = () => {
  return (
    <>
      <ReleaseProvider>
        <div className='mx-2 md:mx-4 mt-8'>
          {/*<LoadReleases />*/}
          <AddedReleases />
        </div>
      </ReleaseProvider>
    </>
  )
}

export default Dashboard
