import { fetchAndParseXML } from "./fetchXML.js";

export default async function getProducts(req, res) {
	try {
		const result = await fetchAndParseXML();
		const products = result?.yml_catalog?.shop?.[0]?.offers?.[0]?.offer?.map((item) => ({
			id: item.$.id,
			name: item.name?.[0] || "",
			price: item.price?.[0] || "",
			images: item.picture || [],
			categoryId: item.categoryId?.[0] || null,
		})) || [];

		if (res) res.json(products);
		return products; // для локального использования
	} catch (err) {
		if (res) res.status(500).json({ error: err.message });
		else throw err;
	}
}
