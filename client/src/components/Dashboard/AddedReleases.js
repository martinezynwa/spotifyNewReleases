import dayjs from 'dayjs'
import useRelease from '../../context/ReleaseContext'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import useUser from '../../context/UserContext'
import SingleRelease from '../Releases/SingleRelease.js'

dayjs.extend(advancedFormat)

const AddedReleases = () => {
  let { releases } = useRelease()
  const { user } = useUser()
  const today = dayjs(new Date()).format('YYYY-MM-DD')

  if (!releases) return

  releases = releases.filter(
    i => i.releaseDate.replace(/-/g, '') === today.replace(/-/g, ''),
  )

  return (
    <>
      <div className='ml-2 md:ml-0'>
        <h2 className="mb-10 text-3xl text-white font-semibold tracking-tight">
          {user ? `Hello ${user?.display_name}` : null}
        </h2>
        <h3 className="mb-10 text-xl md:text-2xl text-white font-semibold tracking-tight">
          {`Releases for ${dayjs(today).format('dddd, MMMM Do')}:`}
        </h3>
      </div>
      {releases.length > 0 ? (
        <div className="grid grid-cols-1 gap-0 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {releases.map(r => (
            <SingleRelease key={r._id} artist={r} />
          ))}
        </div>
      ) : (
        <h3 className="ml-2 md:ml-0 mb-10 text-xl text-white tracking-tight">
          No new releases today
        </h3>
      )}
    </>
  )
}

export default AddedReleases
