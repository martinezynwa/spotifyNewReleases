import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
import dayjs from 'dayjs'
import Release from '../models/Release.cjs'
import dataService from '../util/songsAndAlbums.js'
import logService from '../util/logger.js'

const Artist = require('../models/Artist.cjs')
const router = express.Router()

//synchronize account with followed artists
router.get('/sync', async (request, response) => {
  const { accessToken, userId } = request.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  let nextToken = ''
  let artistsArray = []
  let firstFetch = true

  //getting followed artists from logged profile
  const getItems = async () => {
    firstFetch = false

    //next token becomes available in case 50+ artists are followed
    const res = await dataService.getFollowedArtists(nextToken, userId)
    if (res?.error) return res

    nextToken = res.nextToken

    await Promise.all(
      res.items.map(async i => {
        //checking each artist if it's followed or not
        const artistInDatabase = await Artist.findOne({
          createdBy: userId,
          artistSpotifyId: i.id,
        }).count()

        //if not, new document is created in database
        if (artistInDatabase === 0) {
          const newArtist = new Artist({
            artistName: i.name,
            artistSpotifyId: i.id,
            connectedGroupId: null,
            connectedGroupName: null,
            createdBy: userId,
            createdAt: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
          })
          await newArtist.save()
          artistsArray.push(newArtist)
        }
      }),
    )
  }

  //attempting to fetch artists until nextToken becomes unavailable
  while (nextToken !== null || firstFetch === true) {
    const res = await getItems()

    if (res?.error) {
      return response.status(res.status).json(res.message)
    }
  }
  //returning only newly followed artists back to client
  response.json(
    artistsArray.sort((a, b) => a.artistName.localeCompare(b.artistName)),
  )
})

//remove unfollowed artists
router.get('/remove', async (request, response) => {
  const { accessToken, userId } = request.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  //get artists count from database
  const artistsFromDatabaseCount = await Artist.countDocuments({
    createdBy: userId,
  })

  //get followed artists from spotify
  let nextToken = ''
  let artistsFromSpotify = []
  let firstFetch = true

  //getting followed artists from logged profile
  const getItems = async () => {
    firstFetch = false

    //getting followed artists
    const res = await dataService.getFollowedArtists(nextToken, userId)
    if (res?.error) return res

    nextToken = res.nextToken

    res.items.map(i => {
      artistsFromSpotify.push({
        artistSpotifyId: i.id,
      })
    })

    return res.nextToken
  }

  //attempting to fetch artists until nextToken becomes unavailable
  while (nextToken !== null || firstFetch === true) {
    const res = await getItems()
    if (res?.error) {
      return response.status(res.status).json(res.message)
    }
  }

  //compare amount
  if (artistsFromDatabaseCount !== artistsFromSpotify.length) {
    let artistsFromDatabase = await Artist.find({
      createdBy: userId,
    })

    //find the difference
    artistsFromDatabase = artistsFromDatabase.filter(database => {
      return !artistsFromSpotify.find(spotify => {
        return spotify.artistSpotifyId === database.artistSpotifyId
      })
    })

    //if something was found, remove it from database and releases
    if (artistsFromDatabase.length !== 0) {
      await Promise.all(
        artistsFromDatabase.map(async a => {
          //remove from artists
          await Artist.deleteMany({
            createdBy: userId,
            artistSpotifyId: a.artistSpotifyId,
          })

          //remove from releases
          await Release.deleteMany({
            createdBy: userId,
            artistSpotifyId: a.artistSpotifyId,
          })
        }),
      )
    }
    //returns what was removed
    return response.json(artistsFromDatabase)
  }

  return response.json()
})

export default router
