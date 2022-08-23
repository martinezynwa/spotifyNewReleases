import ReleasesList from '../components/Releases/ReleasesList'
import { ReleaseProvider } from '../context/ReleaseContext.js'

const Releases = () => {
  return (
    <>
      <ReleaseProvider>
        <ReleasesList />
      </ReleaseProvider>
    </>
  )
}

export default Releases
