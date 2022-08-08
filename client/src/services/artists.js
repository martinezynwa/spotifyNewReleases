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

const getReleasedAlbums = async accessToken => {
  const response = await axios.post(
    'http://localhost:3001/artists/releases/albums',
    {
      accessToken,
    },
  )
  return response
}

const getReleasedSongs = async (accessToken, album_id) => {
  const response = await axios.post(
    'http://localhost:3001/artists/releases/songs',
    {
      accessToken,
      album_id,
    },
  )
  return response
}

const addArtistToGroup = async content => {
  const response = await axios.post('http://localhost:3001/artists', content)
  return response
}

const editArtistGroup = async (_id, connectedGroup) => {
  const content = { _id, connectedGroup }
  const response = await axios.put('http://localhost:3001/artists', content)
  return response
}

const getNewReleases = async accessToken => {
  const response = await axios.post('http://localhost:3001/artists/releases', {
    accessToken,
  })
  return response
}

export default {
  getFollowedArtists,
  getArtistsAlbums,
  addArtistToGroup,
  editArtistGroup,
  getNewReleases,
  getReleasedAlbums,
  getReleasedSongs,
}
