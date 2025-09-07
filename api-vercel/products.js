import getProducts from "../api/products.js";

export default async function handler(req, res) {
	return getProducts(req, res);
}
