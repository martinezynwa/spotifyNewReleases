import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import releaseService from '../services/releases.js'
import { accessToken } from '../util/spotifyAuth.js'
import SongList from '../components/Releases/SongList.js'

const ReleasePage = () => {
  const { artistDetail } = useLocation().state
  const [songs, setSongs] = useState([])


  useEffect(() => {
    const getSongs = async () => {
      //API call to get songs from the album
      await releaseService
        .getReleasedSongs(accessToken, artistDetail.albumId)
        .then(res => {
          setSongs(res)
        })
        .catch(err => {
          console.log(`${err.response.status}, ${err.response.data}`)
        })
    }

    getSongs()
  }, [artistDetail])

  return (
    <>
      <div className='pb-8'>
        {songs ? <SongList songs={songs} artist={artistDetail} /> : null}
      </div>
    </>
  )
}

export default ReleasePage
