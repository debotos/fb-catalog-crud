const express = require('express')
const axios = require('axios')

const { fbAccessToken } = require('../../middlewares')
const { handleAxiosError } = require('../../helpers')

const router = express.Router()
const fbApiVersion = process.env.FACEBOOK_API_VERSION || 'v13.0'
const API_BASE = `https://graph.facebook.com/${fbApiVersion}`

const getAllProductsByCatalogID = async (catalog_id, token) => {
	let endpoint = `${API_BASE}/${catalog_id}/products?access_token=${token}&summary=total_count`
	const { data: productsRes } = await axios.get(endpoint)
	// console.log(`Products by catalog id get res:`, productsRes)
	if (!productsRes) throw new Error('Unable to get the products.')
	const { data: productList } = productsRes
	const products = []
	for (const item of productList) {
		const { data: productData } = await axios.get(
			`${API_BASE}/${item.id}?access_token=${token}&fields=additional_image_cdn_urls,additional_image_urls,additional_variant_attributes,age_group,applinks,ar_data,availability,brand,capability_to_review_status,category,category_specific_fields,color,commerce_insights,condition,currency,custom_data,custom_label_0,custom_label_1,custom_label_2,custom_label_3,custom_label_4,custom_number_0,custom_number_1,custom_number_2,custom_number_3,custom_number_4,description,expiration_date,fb_product_category,gender,gtin,image_cdn_urls,image_fetch_status,image_url,images,importer_address,importer_name,invalidation_errors,inventory,manufacturer_info,manufacturer_part_number,marked_for_product_launch,material,mobile_link,name,ordering_index,origin_country,parent_product_id,pattern,price,product_catalog,product_feed,product_group,product_type,quantity_to_sell_on_facebook,retailer_id,retailer_product_group_id,review_rejection_reasons,review_status,sale_price,sale_price_end_date,sale_price_start_date,shipping_weight_unit,shipping_weight_value,short_description,size,start_date,url,visibility,wa_compliance_category`
		)
		products.push(productData)
	}
	return products
}

/* GET /api/v1/catalog/:catalog_id/products */
router.get('/:catalog_id/products', fbAccessToken, async (req, res) => {
	try {
		const token = req.header('Authorization')
		const { catalog_id } = req.params || {}
		if (!catalog_id) throw new Error('Please provide catalog_id.')

		const products = await getAllProductsByCatalogID(catalog_id, token)
		return res.send(products)
	} catch (error) {
		console.log('Products by catalog id get error:')
		const message = handleAxiosError(error)
		return res.status(400).send({ message })
	}
})

/* POST /api/v1/catalog/:catalog_id/product/create */
// Ref: https://developers.facebook.com/docs/marketing-api/reference/product-catalog/products/
router.post('/:catalog_id/product/create', fbAccessToken, async (req, res) => {
	try {
		const token = req.header('Authorization')
		const { catalog_id } = req.params || {}
		if (!catalog_id) throw new Error('Please provide catalog_id.')

		let endpoint = `${API_BASE}/${catalog_id}/products?access_token=${token}`

		const { data: productRes } = await axios.post(endpoint, req.body)
		// console.log(`Add products under catalog id res:`, productRes)
		if (!productRes) throw new Error('Unable to add the product.')

		return res.send(productRes)
	} catch (error) {
		console.log('Add product under catalog error:')
		const message = handleAxiosError(error)
		if (typeof message === 'object' && message !== null) {
			return res.status(400).send(message)
		} else return res.status(400).send({ message })
	}
})

/* PUT /api/v1/catalog/:catalog_id/product/:retailer_id/update */
// Ref: https://developers.facebook.com/docs/marketing-api/reference/product-catalog/batch/
router.put('/:catalog_id/product/:retailer_id/update', fbAccessToken, async (req, res) => {
	try {
		const token = req.header('Authorization')
		const { catalog_id, retailer_id } = req.params || {}
		if (!catalog_id) throw new Error('Please provide catalog_id.')
		if (!retailer_id) throw new Error('Please provide retailer_id.')

		let endpoint = `${API_BASE}/${catalog_id}/batch?access_token=${token}`
		const postData = { allow_upsert: false, requests: [{ retailer_id, method: 'UPDATE', data: req.body }] }
		const { data: productRes } = await axios.post(endpoint, postData)
		// console.log(`Update product res:`, productRes)
		if (!productRes) throw new Error('Unable to update the product.')

		// const products = await getAllProductsByCatalogID(catalog_id, token)
		return res.send({ message: 'Update successful.' })
	} catch (error) {
		console.log('Update product error:')
		const message = handleAxiosError(error)
		if (typeof message === 'object' && message !== null) {
			return res.status(400).send(message)
		} else return res.status(400).send({ message })
	}
})

/* DELETE /api/v1/catalog/:catalog_id/product/:retailer_id/delete */
// Ref: https://developers.facebook.com/docs/marketing-api/reference/product-catalog/batch/
router.delete('/:catalog_id/product/:retailer_id/delete', fbAccessToken, async (req, res) => {
	try {
		const token = req.header('Authorization')
		const { catalog_id, retailer_id } = req.params || {}
		if (!catalog_id) throw new Error('Please provide catalog_id.')
		if (!retailer_id) throw new Error('Please provide retailer_id.')

		let endpoint = `${API_BASE}/${catalog_id}/batch?access_token=${token}`
		const postData = { allow_upsert: false, requests: [{ retailer_id, method: 'DELETE', data: req.body }] }
		const { data: productRes } = await axios.post(endpoint, postData)
		// console.log(`Delete product res:`, productRes)
		if (!productRes) throw new Error('Unable to delete the product.')

		// const products = await getAllProductsByCatalogID(catalog_id, token)
		return res.send({ message: 'Delete successful.' })
	} catch (error) {
		console.log('Delete product error:')
		const message = handleAxiosError(error)
		if (typeof message === 'object' && message !== null) {
			return res.status(400).send(message)
		} else return res.status(400).send({ message })
	}
})

module.exports = router
