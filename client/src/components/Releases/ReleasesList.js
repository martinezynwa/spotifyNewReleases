import SingleRelease from './SingleRelease.js'
import useRelease from '../../context/ReleaseContext'

const ReleasesList = () => {
  const { releases, updateReleases } = useRelease()

  return (
    <>
      <div>
        <button onClick={() => updateReleases()}>Update</button>
        {releases
          ? releases.map(r => <SingleRelease key={r._id} artist={r} />)
          : null}
      </div>
    </>
  )
}

export default ReleasesList
