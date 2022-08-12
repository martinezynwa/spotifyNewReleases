import { useState } from 'react'
import { accessToken } from '../../util/spotifyAuth.js'
import releaseService from '../../services/releases.js'
import SongList from './SongList.js'
import '../../styles/components/Releases.css'

//Component showing songs inside album
const SingleRelease = ({ artist }) => {
  const [songs, setSongs] = useState([])

  const getSongs = async album_id => {
    //button naming logic, when hiding, emptying the array of songs
    if (songs.length !== 0) {
      setSongs([])
      return
    }

    //API call to get songs from the album
    await releaseService
      .getReleasedSongs(accessToken, album_id)
      .then(res => {
        setSongs(res.data)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  return (
    <>
      <div className="releases-container">
        <div className="release">
          {artist.artist_name} - {artist.album_name} - {artist.release_date} -{' '}
          {artist.album_type}
          <button onClick={() => getSongs(artist.album_id)}>
            {songs.length !== 0 ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {songs.length !== 0 ? <SongList songs={songs} /> : null}
    </>
  )
}

export default SingleRelease
