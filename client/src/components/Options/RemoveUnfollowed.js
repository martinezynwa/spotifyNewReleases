import spotifyService from '../../services/spotify'
import useNotification from '../../context/NotificationContext'
import useUser from '../../context/UserContext'
import useLoading from '../../hooks/useLoading.js'

const RemoveUnfollowed = () => {
  const { user } = useUser()
  const { setNotification } = useNotification()
  const { LoadingProgress, triggerLoading, loading } = useLoading()

  const removeUnfollowed = async () => {
    triggerLoading(true)
    await spotifyService
      .removeUnfollowed(user.userId)
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
          message: `Removed: ${res.length} artists`,
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

  return (
    <>
      <div className="flex flex-row justify-between mt-5 items-center gap-8">
        <p className="text-sm md:text-base">
          Remove unfollowed artists on Spotify from groups
        </p>
        {!loading ? (
          <button
            className="bg-active hover:bg-btnhover p-2 w-30 h-15 rounded-lg cursor-pointer"
            onClick={() => removeUnfollowed()}>
            Proceed
          </button>
        ) : (
          <LoadingProgress />
        )}
      </div>
    </>
  )
}

export default RemoveUnfollowed
