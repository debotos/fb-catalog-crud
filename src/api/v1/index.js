const express = require('express')

const fbApi = require('./fb')
const catalogApi = require('./catalog')

const router = express.Router()

router.get('/', (req, res) => {
	res.json({ message: 'Access API - 👋🌎🌍🌏' })
})

router.use('/fb', fbApi)
router.use('/catalog', catalogApi)

module.exports = router
