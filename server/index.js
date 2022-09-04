import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import loginRouter from './controllers/login.js'
import groupRouter from './controllers/groups.js'
import artistRouter from './controllers/artists.js'
import releasesRouter from './controllers/releases.js'
import spotifyRouter from './controllers/spotify.js'
import logRouter from './controllers/logs.js'
import jobs from './util/jobs.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/', loginRouter)
app.use('/groups', groupRouter)
app.use('/artists', artistRouter)
app.use('/releases', releasesRouter)
app.use('/spotify', spotifyRouter)
app.use('/logs', logRouter)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connection to MongoDB:', error.message)
  })

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`)
  jobs.runJobs()
})
