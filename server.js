import express from 'express'
import pkg from 'jsonwebtoken'
const { verify, sign } = pkg
import cors from 'cors'
import BPpkg from 'body-parser'
const { json } = BPpkg
import { writeFile, readFileSync } from 'fs'
const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)))

const dbUserEmail = loadJSON('./db/user.json')
const events = loadJSON('./db/events.json')

const app = express()

app.use(cors())
app.use(json())

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API.'
  })
})

app.get('/dashboard', verifyToken, (req, res) => {
  verify(req.token, 'the_secret_key', (err) => {
    if (err) {
      res.sendStatus(401)
    } else {
      res.json({
        events: events
      })
    }
  })
})

app.post('/register', (req, res) => {
  if (req.body) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
      // In a production app, you'll want to encrypt the password
    }
    const data = JSON.stringify(user, null, 2)

    var errorsToSend = []

    if (dbUserEmail === user.email) {
      errorsToSend.push('An account with this email already exists.')
    }
    if (user.password.length < 5) {
      errorsToSend.push('Password too short.')
    }
    if (errorsToSend.length > 0) {
      res.status(400).json({ errors: errorsToSend })
    } else {
      writeFile('./db/user.json', data, (err) => {
        if (err) {
          console.log(err + data)
        } else {
          const token = sign({ user }, 'the_secret_key')
          // In a production app, you'll want the secret key to be an environment variable
          res.json({
            token,
            email: user.email,
            name: user.name
          })
        }
      })
    }
  } else {
    res.sendStatus(400)
  }
})

app.post('/login', (req, res) => {
  const userDB = readFileSync('./db/user.json')
  const userInfo = JSON.parse(userDB)
  if (req.body && req.body.email === userInfo.email && req.body.password === userInfo.password) {
    const token = sign({ userInfo }, 'the_secret_key')
    // In a production app, you'll want the secret key to be an environment variable
    res.json({
      token,
      email: userInfo.email,
      name: userInfo.name
    })
  } else {
    res.status(401).json({ error: 'Invalid login. Please try again.' })
  }
})

// MIDDLEWARE
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(401)
  }
}

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
