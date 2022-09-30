import spotifyService from '../../services/spotify'
import useNotification from '../../context/NotificationContext'
import useUser from '../../context/UserContext'

const Sync = () => {
  const { setNotification } = useNotification()
  const { user } = useUser()

  const syncFollowedArtists = async () => {
    await spotifyService
      .syncFollowedArtists(user.userId)
      .then(res => {
        if (res.length === 0) {
          setNotification({
            message: 'No difference',
            style: 'success',
          })
          return
        }
        setNotification({
          message: `${res.length} new found`,
          style: 'success',
        })
      })
      .catch(err => {
        setNotification({
          message: `${err.response.status}, ${err.response.data}`,
          style: 'error',
        })
      })
  }

  return (
    <>
      <div className="flex flex-row justify-between mt-5 items-center gap-8">
        <p className='text-sm md:text-base'>Synchronize followed artists from your Spotify account</p>
        <button
          className="bg-active hover:bg-btnhover p-2 w-30 h-15 rounded-lg cursor-pointer"
          onClick={() => syncFollowedArtists()}>
          Proceed
        </button>
      </div>
    </>
  )
}

export default Sync
