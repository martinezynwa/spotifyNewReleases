const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  groupName: {
    type: String,
  },
  connectedPlaylistId: {
    type: String,
  },
  connectedPlaylistName: {
    type: String,
  },
  groupOwner: {
    type: String,
  },
  createdAt: {
    type: String,
  },
})

module.exports = mongoose.model('Group', schema)
