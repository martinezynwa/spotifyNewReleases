const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  artistName: {
    type: String,
  },
  artistSpotifyId: {
    type: String,
  },
  connectedGroupId: {
    type: String,
  },
  connectedGroupName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  artistImage: {
    type: String,
  },
})

module.exports = mongoose.model('Artist', schema)
