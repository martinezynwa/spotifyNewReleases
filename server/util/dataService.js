import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import { day60DaysAgo } from './day60DaysAgo.js'
import logService from './logService.js'

const Artist = require('../models/Artist.cjs')
const Release = require('../models/Release.cjs')
const Group = require('../models/Group.cjs')

//get followed artists
const getFollowedArtists = async (nextToken, userId) => {
  return await axios
    .get(!nextToken ? '/me/following?type=artist&limit=50' : nextToken)
    .then(res => {
      return {
        nextToken: res.data.artists.next,
        items: res.data.artists.items,
      }
    })
    .catch(async err => {
      await logService.addLogToDatabase({
        username: userId,
        action: 'getFollowedArtists',
        message: err.response.data.error.message,
        status: err.response.data.error.status,
        baseUrl: err.config.baseURL,
        url: err.config.url,
      })
      return {
        error: true,
        status: err.response.data.error.status,
        message: err.response.data.error.message,
      }
    })
}

//getting album ID's when fetching new releases
const getAlbums = async (lastFetchDate, userId) => {
  let counter = 0
  let totalCounter = 0
  const artistsArray = []
  let singleArtist = {}

  let artists = await Artist.find({
    createdBy: userId,
  })
  artists = artists.filter(a => a.connectedGroupId !== null)
  //getting album/single releases for artist
  const filterReleases = async artist => {
    let filteredReleases = []

    for (let groupType of ['album', 'single']) {
      counter = counter + 1
      totalCounter = totalCounter + 1
      let items = []

      const res = await axios
        .get(
          `/artists/${artist.artistSpotifyId}/albums?include_groups=${groupType}&limit=5`,
        )
        .then(async res => {
          if (counter === 100) {
            await logService.addLogToDatabase({
              username: userId,
              action: 'counterinfo in filterReleases',
              message: `Processed: ${totalCounter} items`,
            })
            counter = 0
          }
          items = res.data.items
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: userId,
            action: 'filterReleases',
            message: err.data.error.message, // err.response.data.error.message,
            status: err.data.error.status, //err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
          return {
            error: true,
            status: err.response.data.error?.status || err.response.status,
            message:
              err.response.data.error?.message || err.response.statusText,
          }
        })

      if (res?.error) return res

      if (items) {
        //filter releases older than last fetch date
        items = items.filter(
          i =>
            i.release_date.replace(/-/g, '') > lastFetchDate.replace(/-/g, ''),
        )
        filteredReleases.push(...items)
      }
    }

    if (filteredReleases.length !== 0) {
      //in case 2+ artists are listed as creators, only one is picked
      filteredReleases.map(release => {
        if (release.artists.length > 1) {
          //the one whose spotify ID we have
          singleArtist = release.artists.filter(
            a => a.id === artist.artistSpotifyId,
          )
          singleArtist = singleArtist[0]
        } else {
          singleArtist = release.artists[0]
        }

        artistsArray.push({
          createdBy: userId,
          artistSpotifyId: artist.artistSpotifyId,
          albumId: release.id,
          albumName: release.name,
          artistName: singleArtist.name,
          releaseDate: release.release_date,
          albumType: release.type,
          albumImage: release.images[1].url,
          connectedGroupId: artist.connectedGroupId,
        })
      })
    }
  }

  //delay function so the Spotify Web API Rate limit is not triggered
  const delay = () => {
    return new Promise((resolve, reject) => setTimeout(resolve, 1000))
  }

  for (let artist of artists) {
    const res = await filterReleases(artist)
    await delay()
    if (res?.error) return res
  }
  return artistsArray
}

//getting song ID's from albums when fetching new releases
const getSongsOfAlbums = async (albums, userId) => {
  let songsArray = []
  //getting tracks from album
  const response = await Promise.all(
    albums.map(async a => {
      await axios
        .get(`/albums/${a.albumId}/tracks?limit=50`)
        .then(async res => {
          const { connectedPlaylistId } = await Group.findOne({
            _id: a.connectedGroupId,
          })

          res.data.items.map(s => {
            songsArray.push({
              song_id: s.id,
              connectedPlaylistId,
            })
          })
        })
    }),
  ).catch(async err => {
    await logService.addLogToDatabase({
      username: userId,
      action: 'getSongsOfAlbums',
      message: err.response.data.error.message,
      status: err.response.data.error.status,
      baseUrl: err.config.baseURL,
      url: err.config.url,
    })
    return {
      error: true,
      status: err.response.data.error?.status || err.response.status,
      message: err.response.data.error?.message || err.response.statusText,
    }
  })

  if (response?.error) return response

  const ids = songsArray.map(s => s.song_id)
  /*in case two artists release one song and both are followed
    duplicate songs are removed because they are under one ID anyway*/
  const filtered = songsArray.filter(
    ({ song_id }, index) => !ids.includes(song_id, index + 1),
  )
  return filtered
}

//assign songs to playlists when fetching new releases
const assignSongsToPlaylists = async (songs, userId) => {
  //grouping songs per their playlist where they should be put
  const groupedByPlaylist = songs.reduce((obj, song) => {
    const key = song.connectedPlaylistId
    if (obj[key] == null) {
      obj[key] = []
    }

    obj[key].push(`spotify%3Atrack%3A${song.song_id}`)
    return obj
  }, {})

  //inserting songs into their respective playlists
  const insertSongs = async () => {
    for (let [playlistId, songsByPlaylist] of Object.entries(
      groupedByPlaylist,
    )) {
      const songs = songsByPlaylist.join('%2C')
      const res = await axios
        .post(`/playlists/${playlistId}/tracks?uris=${songs}`)
        .catch(async err => {
          await logService.addLogToDatabase({
            username: userId,
            action: 'insertSongs',
            message: err.response.data.error.message,
            status: err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
          return {
            error: true,
            status: err.response.data.error?.status || err.response.status,
            message:
              err.response.data.error?.message || err.response.statusText,
          }
        })
      if (res?.error) return res
    }
  }

  const response = await insertSongs()
  if (response?.error) return response
}

//fetching songs from specific album
const getSongs = async album_id => {
  let songsArray = []
  let items = []

  const response = await axios
    .get(`/albums/${album_id}/tracks?limit=50`)
    .then(res => {
      items = res.data.items
    })
    .catch(async err => {
      await logService.addLogToDatabase({
        username: '',
        action: 'getSongs',
        message: err.response.data.error.message,
        status: err.response.data.error.status,
        baseUrl: err.config.baseURL,
        url: err.config.url,
      })
      return {
        error: true,
        status: err.response.data.error?.status || err.response.status,
        message: err.response.data.error?.message || err.response.statusText,
      }
    })

  if (response?.error) return response

  items.map(i => {
    const artists = i.artists
      .map(a => {
        return a.name
      })
      .join(', ')

    const obj = {
      songNumber: i.track_number,
      songArtist: artists,
      songName: i.name,
      songDuration: i.duration_ms,
    }
    songsArray.push(obj)
  })

  return songsArray
}

const addReleasesToDatabase = async userId => {
  let counter = 0
  let totalCounter = 0
  const allNewReleases = []
  const artists = await Artist.find({ createdBy: userId })

  const filterReleases = async artist => {
    let singleArtist = {}
    let filteredReleases = []
    let allReleasesByArtist = []
    let items = []

    //check album/single releases
    for (let groupType of ['album', 'single']) {
      counter = counter + 1
      totalCounter = totalCounter + 1

      const response = await axios
        .get(
          `/artists/${artist.artistSpotifyId}/albums?include_groups=${groupType}&limit=5`,
        )
        .then(async res => {
          if (counter === 100) {
            await logService.addLogToDatabase({
              username: userId,
              action: 'counterinfo in addReleasesToDatabase',
              message: `Processed: ${totalCounter} items`,
            })
            counter = 0
          }
          items = res.data.items
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: userId,
            action: 'addReleasesToDatabase',
            message: err.response.data.error.message,
            status: err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
          return {
            error: true,
            status: err.response.data.error?.status || err.response.status,
            message:
              err.response.data.error?.message || err.response.statusText,
          }
        })

      if (response?.error) return response

      //filter older than 60 days
      items = items.filter(
        i => i.release_date.replace(/-/g, '') > day60DaysAgo.replace(/-/g, ''),
      )
      filteredReleases.push(...items)
    }

    //filter duplicates from current batch
    filteredReleases = filteredReleases.filter(
      (record, index, array) =>
        array.findIndex(record2 => record2.name === record.name) === index,
    )

    await Promise.all(
      filteredReleases.map(async release => {
        const alreadyInDatabase = await Release.find({
          albumName: release.name,
          createdBy: userId,
        }).count()

        //if already added, do not add again
        if (alreadyInDatabase === 0) {
          if (release.artists.length > 1) {
            singleArtist = release.artists.filter(
              a => a.id === artist.artistSpotifyId,
            )
            singleArtist = singleArtist[0]
          } else {
            singleArtist = release.artists[0]
          }
          allReleasesByArtist.push({
            artistSpotifyId: artist.artistSpotifyId,
            albumId: release.id,
            albumName: release.name,
            artistName: singleArtist.name,
            releaseDate: release.release_date,
            albumType: release.album_type,
            albumImage: release.images[1].url,
          })
        }
      }),
    )

    //add the release into database
    await Promise.all(
      allReleasesByArtist.map(async release => {
        const newRelease = new Release({
          createdBy: userId,
          artistSpotifyId: release.artistSpotifyId,
          albumId: release.albumId,
          albumName: release.albumName,
          artistName: release.artistName,
          releaseDate: release.releaseDate,
          albumType: release.albumType,
          albumImage: release.albumImage,
        })
        await newRelease.save()
        allNewReleases.push(newRelease)
      }),
    )
  }

  //delay function so the Spotify Web API Rate limit is not triggered
  const delay = () => {
    return new Promise((resolve, reject) => setTimeout(resolve, 1000))
  }

  for (let artist of artists) {
    const res = await filterReleases(artist)
    await delay()
    if (res?.error) return res
  }

  await logService.addLogToDatabase({
    username: userId,
    action: 'releases/update-addReleasesToDatabase',
    message: `Updated database with ${
      allNewReleases.length !== 0 ? allNewReleases.length : '0'
    } releases`,
  })

  return allNewReleases
}

export default {
  getFollowedArtists,
  getAlbums,
  getSongs,
  getSongsOfAlbums,
  assignSongsToPlaylists,
  addReleasesToDatabase,
}
