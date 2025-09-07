import { fetchAndParseXML } from "../utils/xmlParser.js";

const XML_URL = "https://i-maxi.com/ocext_yml_feed.xml";

export default async function handler(req, res) {
	try {
		const result = await fetchAndParseXML(XML_URL);

		const products =
			result?.yml_catalog?.shop?.[0]?.offers?.[0]?.offer?.map((item) => ({
				id: item.$.id,
				name: item.name?.[0] || "",
				price: item.price?.[0] || "",
				images: item.picture || [],
				categoryId: item.categoryId?.[0] || null,
			})) || [];

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
