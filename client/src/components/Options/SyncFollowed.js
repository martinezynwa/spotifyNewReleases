import spotifyService from '../../services/spotify'
import useNotification from '../../context/NotificationContext'
import useUser from '../../context/UserContext'
import useLoading from '../../hooks/useLoading.js'

const Sync = () => {
  const { setNotification } = useNotification()
  const { user } = useUser()
  const { LoadingProgress, triggerLoading, loading } = useLoading()

  const syncFollowedArtists = async () => {
    triggerLoading(true)
    await spotifyService
      .syncFollowedArtists(user.userId)
      .then(res => {
        triggerLoading(false)
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
        triggerLoading(false)
        setNotification({
          message: `${err.response.status}, ${err.response.data}`,
          style: 'error',
        })
      })
  }

  const performDemoFunction = () => {
    triggerLoading(true)
    setTimeout(() => {
      triggerLoading(false)
      setNotification({
        message: 'Newly followed artists would have been added',
        style: 'success',
      })
    }, 3000)
  }

  return (
    <>
      <div className="flex flex-row justify-between mt-5 items-center gap-8">
        <p className="text-sm md:text-base">
          Synchronize followed artists from your Spotify account
        </p>
        {!loading ? (
          <button
            className="bg-active hover:bg-btnhover p-2 w-30 h-15 rounded-lg cursor-pointer"
            onClick={() => {
              user.userId !== process.env.REACT_APP_TEST_USER_ID
                ? syncFollowedArtists()
                : performDemoFunction()
              return
            }}>
            Proceed
          </button>
        ) : (
          <LoadingProgress />
        )}
      </div>
    </>
  )
}

export default Sync
