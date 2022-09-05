import { useState } from 'react'
import { accessToken } from '../../util/spotifyAuth.js'
import releaseService from '../../services/releases.js'
import SongList from './SongList.js'

//Component showing songs inside album
const SingleRelease = ({ artist }) => {
  const [songs, setSongs] = useState([])

  const getSongs = async albumId => {
    //button naming logic, when hiding, emptying the array of songs
    if (songs.length !== 0) {
      setSongs([])
      return
    }

    //API call to get songs from the album
    await releaseService
      .getReleasedSongs(accessToken, albumId)
      .then(res => {
        setSongs(res)
      })
      .catch(err => {
        console.log(`${err.response.status}, ${err.response.data}`)
      })
  }

  return (
    <>
      <div>
        <div>
          {artist.artistName} - {artist.albumName} - {artist.releaseDate} -{' '}
          {artist.albumType}
          <button onClick={() => getSongs(artist.albumId)}>
            {songs.length !== 0 ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {songs.length !== 0 ? <SongList songs={songs} /> : null}
    </>
  )
}

export default SingleRelease
