import { useState, useEffect } from 'react'
import releaseService from '../../services/releases.js'
import { accessToken } from '../../util/spotifyAuth.js'
import SingleRelease from './SingleRelease.js'

const ReleasesList = () => {
  const [releases, setReleases] = useState([])
  const [loadingTrigger, setLoadingTrigger] = useState(false)

  useEffect(() => {
    const getData = async () => {
      setLoadingTrigger(true)
      await releaseService
        .getReleasedAlbums(accessToken)
        .then(res => {
          setReleases(res.data)
          setLoadingTrigger(false)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    getData()
  }, [])

  return (
    <>
      <div>
        {loadingTrigger ? <p>Checking latest releases...</p> : null}
        {releases.map(r => (
          <SingleRelease key={r.album_id} artist={r} />
        ))}
      </div>
    </>
  )
}

export default ReleasesList
