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
})

module.exports = mongoose.model('User', schema)
