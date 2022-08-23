import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import { day30DaysAgo } from '../util/day30DaysAgo.js'

const Artist = require('../models/Artist.cjs')
const Release = require('../models/Release.cjs')
const Group = require('../models/Group.cjs')

//getting album ID's when fetching new releases
const getAlbums = async (lastFetchDate, userId) => {
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
      let response = await axios
        .get(
          `/artists/${artist.artistSpotifyId}/albums?include_groups=${groupType}&limit=5`,
        )
        .catch(err => {
          return err.status
        })
      let items = response.data.items

      //filter releases older than last fetch date
      items = items.filter(
        i =>
          i.release_date.replace(/-/g, '') >= lastFetchDate.replace(/-/g, ''),
      )
      filteredReleases.push(...items)
    }

    //in case 2+ artists are listed as creators, only one is picked
    if (filteredReleases.length !== 0) {
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
          artistName: artist.artistName,
          albumName: release.name,
          connectedGroupId: artist.connectedGroupId,
          albumId: release.id,
        })
      })
    }
  }

  for (let artist of artists) {
    await filterReleases(artist)
  }

  return artistsArray
}

//getting song ID's from albums when fetching new releases
const getSongsOfAlbums = async albums => {
  let songsArray = []

  //getting tracks from album
  await Promise.all(
    albums.map(async a => {
      const { data } = await axios.get(`/albums/${a.albumId}/tracks?limit=50`)
      const { connectedPlaylistId } = await Group.findOne({
        _id: a.connectedGroupId,
      })

      data.items.map(s => {
        songsArray.push({
          song_id: s.id,
          connectedPlaylistId,
        })
      })
    }),
  )

  const ids = songsArray.map(s => s.song_id)
  /*in case two artists release one song and both are followed
    duplicate songs are removed because they are under one ID anyway*/
  const filtered = songsArray.filter(
    ({ song_id }, index) => !ids.includes(song_id, index + 1),
  )

  return filtered
}

//assign songs to playlists when fetching new releases
const assignSongsToPlaylists = async songs => {
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
  for (let [playlistId, songsByPlaylist] of Object.entries(groupedByPlaylist)) {
    const songs = songsByPlaylist.join('%2C')
    await axios.post(`/playlists/${playlistId}/tracks?uris=${songs}`)
  }
}

//fetching songs from specific album
const getSongs = async album_id => {
  let songsArray = []
  const { data } = await axios.get(`/albums/${album_id}/tracks?limit=50`)

  data.items.map(i => {
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
  const allNewReleases = []
  const artists = await Artist.find({ createdBy: userId })

  const filterReleases = async artist => {
    let singleArtist = {}
    let filteredReleases = []
    let allReleasesByArtist = []

    //check album/single releases
    for (let groupType of ['album', 'single']) {
      let response = await axios
        .get(
          `/artists/${artist.artistSpotifyId}/albums?include_groups=${groupType}&limit=5`,
        )
        .catch(err => {
          return err.status
        })
      let items = response.data.items

      //filter older than 30 days
      items = items.filter(
        i => i.release_date.replace(/-/g, '') > day30DaysAgo.replace(/-/g, ''),
      )
      filteredReleases.push(...items)
    }

    await Promise.all(
      filteredReleases.map(async release => {
        const alreadyInDatabase = await Release.find({
          albumId: release.id,
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
        const response = await newRelease.save()
        allNewReleases.push(newRelease)
      }),
    )
  }

  for (let artist of artists) {
    await filterReleases(artist)
  }

  return allNewReleases
}

export default {
  getAlbums,
  getSongs,
  getSongsOfAlbums,
  assignSongsToPlaylists,
  addReleasesToDatabase,
}
