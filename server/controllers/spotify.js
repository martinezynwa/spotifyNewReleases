import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import axios from 'axios'
import express from 'express'
import dayjs from 'dayjs'
import Release from '../models/Release.cjs'

const Artist = require('../models/Artist.cjs')

const router = express.Router()

//synchronize account with followed artists
router.get('/sync', async (req, res) => {
  const { accessToken, userId } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  let nextToken = ''
  let artistsArray = []

  //getting followed artists from logged profile
  const getItems = async nextToken => {
    let res = []

    //next token becomes available in case 50+ artists are followed
    if (!nextToken) {
      res = await axios.get('/me/following?type=artist&limit=50')
    } else {
      res = await axios.get(nextToken)
    }

    const { items } = res.data.artists

    await Promise.all(
      items.map(async i => {
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

    return res.data.artists.next
  }

  //first fetch request
  nextToken = await getItems()

  //attempting to fetch artists until nextToken becomes unavailable
  while (nextToken !== null) {
    nextToken = await getItems(nextToken)
  }

  //returning only newly followed artists back to client
  res.json(
    artistsArray.sort((a, b) => a.artistName.localeCompare(b.artistName)),
  )
})

//remove unfollowed artists
router.get('/remove', async (req, res) => {
  const { accessToken, userId } = req.query
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`

  //get artists count from database
  const artistsFromDatabaseCount = await Artist.countDocuments({
    createdBy: userId,
  })

  //get followed artists from spotify
  let nextToken = ''
  let artistsFromSpotify = []

  //get followed Artists on Spotify
  const getItems = async nextToken => {
    let res = []

    if (!nextToken) {
      res = await axios.get('/me/following?type=artist&limit=50')
    } else {
      res = await axios.get(nextToken)
    }

    const { items } = res.data.artists

    items.map(i => {
      artistsFromSpotify.push({
        artistSpotifyId: i.id,
      })
    })

    return res.data.artists.next
  }

  nextToken = await getItems()

  while (nextToken !== null) {
    nextToken = await getItems(nextToken)
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
    return res.json(artistsFromDatabase)
  }
  return res.json()
})

export default router
