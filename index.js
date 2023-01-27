const express = require('express')
// const bp = require('body-parser')
const app = express()

// var finalhandler = require('finalhandler')
const http = require('http')
const morgan = require('morgan')

const cors = require('cors')


// app.use(bp.json())
// app.use(bp.urlencoded({ extended: true }))

app.use(express.json())
app.use(cors())

app.use(express.static('build'))

// console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
morgan.token("morganToken", function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :morganToken"))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas Server 2", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


  
const generateId = () => {
    const max = 10000
    return Math.floor(Math.random() * max);
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    const personName = persons.filter(person => person.name === body.name) 
  
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
    else if (personName.length > 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
    persons = persons.concat(person)
  
    response.json(person)
})


// app.get('/', (request, response) => {
//     response.send('<h1>Hello World!</h1>')
// })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(person => person.id === id)
    
    if (person.length > 0) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const meddelande = `Phonebook has info for ${persons.length} people\n\n${new Date()}`
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(meddelande)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
