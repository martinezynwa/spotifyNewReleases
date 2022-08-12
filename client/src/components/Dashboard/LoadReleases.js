import { useState } from 'react'
import releaseService from '../../services/releases.js'
import { accessToken } from '../../util/spotifyAuth.js'
import userService from '../../services/user'
import AlbumsAdded from './AlbumsAdded.js'

const LoadReleases = () => {
  const [success, setSuccess] = useState(false)
  const [loadingTrigger, setLoadingTrigger] = useState(false)
  const [albumsAdded, setAlbumsAdded] = useState([])

  const triggerAction = async () => {
    setLoadingTrigger(true)
    const { id: userId } = await userService.getLoggedUser()

    await releaseService
      .getNewReleases(accessToken, userId)
      .then(res => {
        setAlbumsAdded(res.data)
        setLoadingTrigger(false)
        setSuccess(true)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  return (
    <>
      <div>
        <button onClick={() => triggerAction()}>Get New Releases</button>
        {loadingTrigger ? <p>Loading...</p> : null}
        {success ? <AlbumsAdded albums={albumsAdded} /> : null}
      </div>
    </>
  )
}

export default LoadReleases
