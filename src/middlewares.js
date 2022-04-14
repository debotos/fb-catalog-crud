function notFound(req, res, next) {
	res.status(404)
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
	next(error)
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500
	res.status(statusCode)
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
	})
}

function fbAccessToken(req, res, next) {
	const token = req.header('Authorization')
	if (!token) return res.status(401).send('Access denied. No access token provided.')
	next()
}

module.exports = { notFound, errorHandler, fbAccessToken }
