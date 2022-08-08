import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import axios from 'axios'

let lastFetchDate = '2022-07-20'
lastFetchDate = lastFetchDate.replace(/-/g, '')

const getAlbums = async artists => {
  let artistsArray = []
  let singleArtist
  for (let artist of artists) {
    let { data } = await axios.get(
      `/artists/${artist.artistSpotifyId}/albums?include_groups=album%2Csingle&limit=50`,
    )
    data.items = data.items.filter(
      a => a.release_date.replace(/-/g, '') >= lastFetchDate,
    )
    data.items.map(a => {
      if (a.artists.length > 1) {
        singleArtist = a.artists.filter(a => a.id === artist.artistSpotifyId)
        singleArtist = singleArtist[0]
      } else {
        singleArtist = a.artists[0]
      }

      const obj = {
        album_id: a.id,
        album_name: a.name,
        release_date: a.release_date,
        artist_id: singleArtist.id,
        artist_name: singleArtist.name,
        album_type: a.album_type,
        album_image: a.images[1].url,
      }
      artistsArray.push(obj)
    })
  }
  return artistsArray
}

const getSongs = async album_id => {
  let songsArray = []

  const { data } = await axios.get(`/albums/${album_id}/tracks?limit=50`)
  data.items.map(s => {
    const artists = s.artists
      .map(a => {
        return a.name
      })
      .join(', ')

    const obj = {
      track_number: s.track_number,
      song_name: s.name,
      artists: artists,
      duration_ms: s.duration_ms,
    }
    songsArray.push(obj)
  })

  return songsArray
}

export default {
  getAlbums,
  getSongs,
}
