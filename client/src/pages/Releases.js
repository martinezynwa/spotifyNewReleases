import ReleasesList from '../components/Releases/ReleasesList'
import { ReleaseProvider } from '../context/ReleaseContext.js'

const Releases = () => {
  return (
    <>
      <div className="mx-2 md:mx-4 mt-8 pb-10">
        <ReleaseProvider>
          <ReleasesList />
        </ReleaseProvider>
      </div>
    </>
  )
}

export default Releases
