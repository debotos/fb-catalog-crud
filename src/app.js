const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
var passport = require('passport')

require('dotenv').config()

const middlewares = require('./middlewares')
const api = require('./api/v1')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())
require('./fb-passport')()

app.use(
	require('express-session')({
		secret: process.env.SESSION_SECRET || 'keyboard cat',
		resave: false,
		saveUninitialized: false,
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
	res.json({ message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄' })
})

app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
