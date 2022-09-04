const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  action : {
    type: String,
  },
  message: {
    type: String,
  },
  statusCode: {
    type: String,
  },
  errorUrl: {
    type: String,
  },
})

module.exports = mongoose.model('Log', schema)
