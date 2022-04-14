const express = require('express')
const axios = require('axios')
const qs = require('qs')
var passport = require('passport')

const { fbAccessToken } = require('../../middlewares')
const { handleAxiosError, getFullReqUrl } = require('../../helpers')

const router = express.Router()

/* GET /api/v1/catalog/:catalog_id/products */
router.get('/:catalog_id/products', fbAccessToken, async (req, res) => {
	try {
		const token = req.header('Authorization')
		const { catalog_id } = req.params || {}
		if (!catalog_id) throw new Error('Please provide catalog_id.')

		let endpoint = `https://graph.facebook.com/v13.0/${catalog_id}/products?access_token=${token}&summary=total_count`
		const { data } = await axios.get(endpoint)
		console.log(`Products by catalog id get res:`, data)
		if (!data) throw new Error('Unable to get the products.')

		return res.send(data)
	} catch (error) {
		console.log('Products by catalog id get error:')
		const message = handleAxiosError(error)
		return res.status(400).send({ message })
	}
})

module.exports = router
