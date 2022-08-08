import { useState } from 'react'
import { accessToken } from '../../util/spotifyAuth.js'
import artistService from '../../services/artists.js'
import SongList from './SongList.js'
import '../../styles/components/Releases.css'

const SingleRelease = ({ artist }) => {
  const [songs, setSongs] = useState([])

  const getSongs = async album_id => {
    await artistService
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
          <button onClick={() => getSongs(artist.album_id)}>songs</button>
          <button onClick={() => setSongs([])}>hide</button>
        </div>
      </div>
      {songs.length !== 0 ? <SongList songs={songs} /> : null}
    </>
  )
}

export default SingleRelease
