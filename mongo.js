const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number= process.argv[4]

const url =
    `mongodb+srv://nikand:${password}@cluster0.ct15dqj.mongodb.net/personApp?retryWrites=true&w=majority`
  // `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person ({
    name: name,
    number:number,
})

if (process.argv.length>4) {
    person.save().then(result => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
    })
}

Person.find({}).then(result => {
    console.log('phonebook')
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
