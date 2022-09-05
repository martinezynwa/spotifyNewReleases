import { useState } from 'react'
import releaseService from '../../services/releases.js'
import { accessToken } from '../../util/spotifyAuth.js'
import userService from '../../services/user'
import AlbumsAdded from './AlbumsAdded.js'
import useNotification from '../../context/NotificationContext'
import useLoading from '../../hooks/useLoading.js'

const LoadReleases = () => {
  const [success, setSuccess] = useState(false)
  const [albumsAdded, setAlbumsAdded] = useState([])
  const { setNotification } = useNotification()
  const { triggerLoading, LoadingProgress } = useLoading()

  const triggerAction = async () => {
    const { id: userId } = await userService.getLoggedUser()
    triggerLoading(true, 'Updating your playlists with new releases...')

    await releaseService
      .getNewReleases(accessToken, userId)
      .then(res => {
        setAlbumsAdded(res)
        setSuccess(true)
        setNotification({
          message: res.length > 0 ? `Added ${res.length}` : 'Nothing added',
          style: 'success',
        })
        triggerLoading(false)
      })
      .catch(err => {
        setNotification({
          message: `${err.response.status}, ${err.response.data}`,
          style: 'error',
        })
        triggerLoading(false)
      })
  }

  return (
    <>
      <>
        <button onClick={() => triggerAction()}>Get New Releases</button>
        <LoadingProgress />
        {success ? <AlbumsAdded albums={albumsAdded} /> : null}
      </>
    </>
  )
}

export default LoadReleases
