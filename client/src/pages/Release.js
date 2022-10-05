import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import releaseService from '../services/releases.js'
import { accessToken } from '../util/spotifyAuth.js'
import SongList from '../components/Releases/SongList.js'
import useLoading from '../hooks/useLoading.js'

const ReleasePage = () => {
  const { artistDetail } = useLocation().state
  const [songs, setSongs] = useState([])
  const { LoadingProgress, triggerLoading } = useLoading()

  useEffect(() => {
    const getSongs = async () => {
      triggerLoading(true)
      //API call to get songs from the album
      await releaseService
        .getReleasedSongs(accessToken, artistDetail.albumId)
        .then(res => {
          triggerLoading(false)
          setSongs(res)
        })
        .catch(err => {
          triggerLoading(false)
          console.log(`${err.response.status}, ${err.response.data}`)
        })
    }

    getSongs()
  }, [artistDetail])

  return (
    <>
      <div className="pb-8">
        {songs ? <SongList songs={songs} artist={artistDetail} /> : null}
        <LoadingProgress />
      </div>
    </>
  )
}

export default ReleasePage
