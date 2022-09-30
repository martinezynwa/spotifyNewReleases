const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  allColors: {
    type: Object,
  },

  
})

module.exports = mongoose.model('Util', schema)
