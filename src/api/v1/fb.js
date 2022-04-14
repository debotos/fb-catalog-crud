const express = require('express')
const axios = require('axios')
var passport = require('passport')

const { handleAxiosError, getFullReqUrl } = require('../../helpers')

const router = express.Router()
const appID = process.env['FACEBOOK_CLIENT_ID']
const appSecret = process.env['FACEBOOK_CLIENT_SECRET']
const fbApiVersion = process.env.FACEBOOK_API_VERSION || 'v13.0'

/* GET /api/v1/fb/login */
router.get(
	'/login',
	passport.authenticate('facebook', { scope: ['email', 'catalog_management', 'business_management', 'public_profile'] })
)

/* GET /api/v1/fb/oauth2/redirect */
router.get('/oauth2/redirect', async (req, res) => {
	try {
		const { code } = req.query || {}
		if (!code) throw new Error('Failed to login facebook.')
		const fullUrl = getFullReqUrl(req)

		// Get the short-lived Access Token by passing the code
		const {
			data: { access_token },
		} = await axios.get(
			`https://graph.facebook.com/${fbApiVersion}/oauth/access_token?code=${code}&client_id=${appID}&client_secret=${appSecret}&redirect_uri=${fullUrl}`
		)

		// Get long-lived Access Token by passing the short-lived access token (Valid for 60 days)
		const { data } = await axios.get(
			`https://graph.facebook.com/${fbApiVersion}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appID}&client_secret=${appSecret}&fb_exchange_token=${access_token}`
		)

		return res.send({ ...data, token_title: 'Long-Lived Token' })
	} catch (error) {
		console.log('FB oAuth redirect Error: ')
		const message = handleAxiosError(error)
		return res.status(400).send({ message })
	}
})

module.exports = router
