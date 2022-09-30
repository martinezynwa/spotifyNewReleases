import useRelease from '../../context/ReleaseContext'
import useLoading from '../../hooks/useLoading.js'
import Icon from '../../util/Icons'

const UpdateButton = () => {
  const { updateReleases } = useRelease()
  const { LoadingProgress, triggerLoading, loading } = useLoading()

  const triggerUpdate = async () => {
    triggerLoading(true, 'Checking new releases')
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
