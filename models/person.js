const mongoose = require('mongoose')
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      require: true
    },
    number: {
      type: String,
      required: true,
      match: /^(\d{2}-\d{6,})|^(\d{3}-\d{5,})|^(\d{8,})$/,
    }
  })

// const Person = mongoose.model('Person', personSchema)
personSchema.plugin(uniqueValidator)

personSchema
  .set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)





  
 