const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  spotify_id: {
    type: String,
  },
  spotify_name: {
    type: String,
  },
  registeredAt: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  lastFetchDate: {
    type: String,
  },
  lastFetchNewArtistsSync: {
    type: Boolean,
  },
  lastFetchNewAlbumsAdded: {
    type: Boolean,
  },
})

module.exports = mongoose.model('User', schema)
