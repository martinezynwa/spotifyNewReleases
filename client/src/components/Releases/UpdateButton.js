import useRelease from '../../context/ReleaseContext'
import useLoading from '../../hooks/useLoading.js'

const UpdateButton = () => {
  const { updateReleases } = useRelease()
  const { LoadingProgress, triggerLoading } = useLoading()

  const triggerUpdate = async () => {
    triggerLoading(true, 'Checking new releases')
    await updateReleases()
    triggerLoading(false)
  }

  return (
    <>
      <button onClick={() => triggerUpdate()}>Update</button>
      <LoadingProgress />
    </>
  )
}

export default UpdateButton
