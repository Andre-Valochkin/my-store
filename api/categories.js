import { fetchAndParseXML } from "../../utils/xmlParser.js";

const XML_URL = "https://i-maxi.com/ocext_yml_feed.xml";

export default async function handler(req, res) {
	try {
		const result = await fetchAndParseXML(XML_URL);

		const categoriesXml = result?.yml_catalog?.shop?.[0]?.categories?.[0]?.category || [];
		const categoriesMap = {};
		const rootCategories = [];

		categoriesXml.forEach((cat) => {
			const id = cat.$.id;
			const parentId = cat.$.parentId || null;
			const name = (cat._ || "").trim();
			const categoryObj = { id, name, subcategories: [] };
			categoriesMap[id] = categoryObj;

			if (parentId) {
				if (categoriesMap[parentId]) {
					categoriesMap[parentId].subcategories.push(categoryObj);
				} else {
					categoriesMap[parentId] = { id: parentId, name: "", subcategories: [categoryObj] };
				}
			} else {
				rootCategories.push(categoryObj);
			}
		});

		res.status(200).json({ categories: rootCategories });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
