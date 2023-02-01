require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// const bp = require('body-parser')
// var finalhandler = require('finalhandler')
// const http = require('http')

const app = express()
const Person = require('./models/person')





app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// app.use(finalhandler) // request.body is undefined!

// console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
morgan.token("morganToken", function (req, res) {
  // const body = req.body
  // console.log("morganToken: ", body.name, body.number)
  return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :morganToken"))



// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas Server 2", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log("name: ", body.name)
  console.log("number:", body.number)

  if (!body.name ) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }

  const personObject = new Person({
      name: body.name,
      number: body.number,
  })


  personObject
    .save()
    .then(savedPerson => response.json(savedPerson) )
    .catch(error => next(error) )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    console.log('Test get')
    response.json(notes)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        console.log(person)
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))     
})



app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    console.log('Test info get')
    const meddelande = `Phonebook has info for ${persons.length} people\n\n${new Date(Date.now() )}`
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(meddelande)
  })
  
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person)
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
  
//     response.status(204).end()
// })


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.error('error.name', error.name)

  if (error.name === 'CastError') {
    console.error('CastError')
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    console.error('ValidationError')
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
