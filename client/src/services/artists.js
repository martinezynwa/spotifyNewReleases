import axios from 'axios'
import { accessToken } from '../util/spotifyAuth.js'

let nextToken = ''
axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

const getFollowedArtists = async () => {
  let artistsArray = []

  await axios.get('/me/following?type=artist&limit=50').then(res => {
    artistsArray.push(...res.data.artists.items)
    nextToken = res.data.artists.next
  })

  while (nextToken !== null) {
    // eslint-disable-next-line no-loop-func
    await axios.get(nextToken).then(res => {
      artistsArray.push(...res.data.artists.items)
      nextToken = res.data.artists.next
    })
  }
  return artistsArray.sort((a, b) => a.name.localeCompare(b.name))
}

const getArtistsAlbums = async () => {
  let artistAlbums = []
  await axios
    .get(
      '/artists/5tDjiBYUsTqzd0RkTZxK7u/albums?include_groups=album%2Csingle&limit=50',
    )
    .then(res => {
      artistAlbums.push(...res.data.items)
      nextToken = res.data.next
    })

  while (nextToken !== null) {
    // eslint-disable-next-line no-loop-func
    await axios.get(nextToken).then(res => {
      artistAlbums.push(...res.data.items)
      nextToken = res.data.next
    })
  }
  return artistAlbums
}

export default { getFollowedArtists, getArtistsAlbums }
