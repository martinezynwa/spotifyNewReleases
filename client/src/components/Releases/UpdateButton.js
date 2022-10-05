import useRelease from '../../context/ReleaseContext'
import useLoading from '../../hooks/useLoading.js'
import Icon from '../../util/Icons'
import useUser from '../../context/UserContext'
import useNotification from '../../context/NotificationContext'

const UpdateButton = () => {
  const { updateReleases } = useRelease()
  const { LoadingProgress, triggerLoading, loading } = useLoading()
  const { user } = useUser()
  const { setNotification } = useNotification()

  const triggerUpdate = async () => {
    if (user.userId === process.env.REACT_APP_TEST_USER_ID) {
      triggerLoading(
        true,
        'Checking new releases, it may take a couple of minutes if your library is big.',
      )
      setTimeout(() => {
        triggerLoading(false)
        setNotification({
          message: 'Nothing added because this is a demo only',
          style: 'success',
        })
      }, 3000)

      return
    }
    triggerLoading(
      true,
      'Checking new releases, it may take a couple of minutes if your library is big.',
    )
    await updateReleases()
    triggerLoading(false)
  }

  return (
    <>
      <div
        className={`${
          loading ? 'hidden ' : null
        } flex flex-row p-2 mb-4 w-28 hover:bg-btnhover bg-album rounded-lg  cursor-pointer`}
        onClick={() => triggerUpdate()}>
        <button className="m-auto">
          <Icon name="Refresh" size={'desktop'} />
        </button>
        <p className="ml-2 text-md font-semibold">Refresh</p>
      </div>
      <LoadingProgress />
    </>
  )
}

export default UpdateButton
