const app = require('./app')

const port = process.env.PORT || 5000

// Logging production environment variable
if (process.env.NODE_ENV === 'production') {
	console.log('Environment Variables: \n', process.env)
}

app.listen(port, () => {
	/* eslint-disable no-console */
	console.log(`🚀 Server is up on port: ${port}`)
	/* eslint-enable no-console */
})
