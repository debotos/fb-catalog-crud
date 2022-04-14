function handleAxiosError(error) {
	let msg
	if (error.response) {
		/*
		 * The request was made and the server responded with a
		 * status code that falls out of the range of 2xx
		 */
		console.log('Error Data: \n', JSON.stringify(error.response.data, null, 2))
		console.log('Error Status: \n', error.response.status)
		console.log('Error Headers: \n', error.response.headers)
		if (error.response && error.response.data) {
			const { data, message, Message, ErrorDescription } = error.response.data
			if (data) {
				msg = data
			} else if (message || Message) {
				msg = message || Message
			} else if (ErrorDescription) {
				msg = ErrorDescription
			}
		}
	} else if (error.request) {
		/*
		 * The request was made but no response was received, `error.request`
		 * is an instance of XMLHttpRequest in the browser and an instance
		 * of http.ClientRequest in Node.js
		 */
		console.log('Error Request: \n', error.request)
		msg = 'Something went wrong. Please try again!'
	} else {
		// Something happened in setting up the request and triggered an Error
		console.log('Error Message: \n', error.message)
		msg = error.message
	}

	return msg || 'Sorry, unable to process right now.'
}

const isEmpty = (value) =>
	value === undefined ||
	value === 'undefined' ||
	value === null ||
	value === 'null' ||
	(typeof value === 'object' && Object.keys(value).length === 0) ||
	(typeof value === 'string' && value.trim().length === 0)

const getFullReqUrl = (req) => {
	if (!req) return ''
	const protocol = req.protocol
	const host = req.hostname
	const url = req.originalUrl
	const port = process.env.PORT || 5000
	const fullUrl = `${protocol}://${host}:${port}${url}`
	return fullUrl
}

module.exports = { getFullReqUrl, isEmpty, handleAxiosError }
