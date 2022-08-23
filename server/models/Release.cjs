const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  createdBy: {
    type: String,
  },
  artistSpotifyId: {
    type: String,
  },
  albumId: {
    type: String,
  },
  albumName: {
    type: String,
  },
  artistName: {
    type: String,
  },
  releaseDate: {
    type: String,
  },
  albumType: {
    type: String,
  },
  albumImage: {
    type: String,
  },
})

module.exports = mongoose.model('Release', schema)
