import { fetchAndParseXML } from "./fetchXML.js";

export default async function getCategories(req, res) {
	try {
		const result = await fetchAndParseXML();
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

		if (res) res.json({ categories: rootCategories });
		return rootCategories; // для локального использования
	} catch (err) {
		if (res) res.status(500).json({ error: err.message });
		else throw err;
	}
}
