import { useState } from 'react'
import artistsService from '../../services/artists.js'
import { accessToken } from '../../util/spotifyAuth.js'

const LoadReleases = () => {
  const [success, setSuccess] = useState(false)
  const [loadingTrigger, setLoadingTrigger] = useState(false)
  const triggerAction = async () => {
    setLoadingTrigger(true)
    await artistsService
      .getNewReleases(accessToken)
      .then(res => {
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
        {success ? <p>Sucessfully loaded</p> : null}
      </div>
    </>
  )
}

export default LoadReleases
