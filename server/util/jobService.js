import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import logService from './logService.js'
import dataService from './dataService.js'
import userInfoService from './userInfoService.js'

const cron = require('node-cron')
const User = require('../models/User.cjs')
const Release = require('../models/Release.cjs')
import { day60DaysAgo } from './day60DaysAgo.js'

const initJobs = async () => {
  const runEveryDay = cron.schedule('55 28 08 * * *', async () => {
    const users = await User.find()

    for (let user of users) {
      let accessToken = ''

      await logService.addLogToDatabase({
        username: user.spotify_id,
        action: 'job started',
        message: 'Schedule triggered',
      })

      //-----step 1 - getting new access token from refresh token-----\\
      await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${new Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
          ).toString('base64')}`,
        },
      })
        .then(async res => {
          accessToken = res.data.access_token
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-refresh_token',
            message: err.response.data.error_description,
            status: err.response.data.error,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
        })

      axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

      //-----step 2 - synchronize newly followed artists-----\\
      await axios
        .get(`${process.env.BACKEND_URI}/spotify/sync`, {
          params: {
            accessToken,
            userId: user.spotify_id,
          },
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-spotify/sync',
            message: err.response.data.error.message,
            status: err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
        })

      //-----step 3 - remove unfollowed artists-----\\
      await axios
        .get(`${process.env.BACKEND_URI}/spotify/remove`, {
          params: {
            accessToken,
            userId: user.spotify_id,
          },
        })
        .catch(async err => {
          await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-spotify/remove',
            message: err.response.data.error.message,
            status: err.response.data.error.status,
            baseUrl: err.config.baseURL,
            url: err.config.url,
          })
        })

      //-----step 4 - get new releases-----\\
      const lastFetchDate = user.lastFetchDate.replace(/-/g, '')

      //get albums from artists
      let albums = await dataService.getAlbums(lastFetchDate, user.spotify_id)

      if (albums?.error) {
        return await logService.addLogToDatabase({
          username: user.spotify_id,
          action: 'jobs-spotify/releases-getAlbums',
          message: albums.message,
          status: albums.status,
        })
      }

      //clear duplicates
      albums = albums.filter(
        (record, index, array) =>
          array.findIndex(record2 => record2.albumName === record.albumName) ===
          index,
      )

      //log addition
      await logService.addLogToDatabase({
        username: user.spotify_id,
        action: 'releases/all-albums',
        message: `Added ${albums.length} new albums`,
      })

      //if no new albums, it's pointless to get songs
      if (albums.length > 0) {
        //get songs from previously loaded albums
        const songs = await dataService.getSongsOfAlbums(
          albums,
          user.spotify_id,
        )

        if (songs?.error) {
          return await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-spotify/songs-getSongs',
            message: songs.message,
            status: songs.status,
          })
        }

        //add songs to respective playlists
        const added = await dataService.assignSongsToPlaylists(
          songs,
          user.spotify_id,
        )

        if (added?.error) {
          return await logService.addLogToDatabase({
            username: user.spotify_id,
            action: 'jobs-spotify/songs-assignToPlaylists',
            message: added.message,
            status: added.status,
          })
        }

        //log addition
        await logService.addLogToDatabase({
          username: user.spotify_id,
          action: 'releases/all-songs',
          message: `Added ${songs.length} new songs`,
        })
      }

      //update last fetch date in user's profile
      await userInfoService.updateFetchDate(user.spotify_id)

      //-----step 5 - update releases page-----\\
      if (albums.length > 0) {
        //add new releases to database
        await Promise.all(
          albums.map(async a => {
            const newRelease = new Release({
              createdBy: a.createdBy,
              artistSpotifyId: a.artistSpotifyId,
              albumId: a.albumId,
              albumName: a.albumName,
              artistName: a.artistName,
              releaseDate: a.releaseDate,
              albumType: a.albumType,
              albumImage: a.albumImage,
            })
            await newRelease.save()
          }),
        )

        //log addition
        await logService.addLogToDatabase({
          username: user.spotify_id,
          action: 'releases/update',
          message: 'Updated releases database',
        })
      }

      //remove releases older than 60 days from database
      await Release.deleteMany({ releaseDate: { $lt: day60DaysAgo } })
    }

    //log addition
    await logService.addLogToDatabase({
      username: '',
      action: 'job info',
      message: 'Finished checking all users',
    })
  })
  runEveryDay.start()
}

export default initJobs
