import express from "express";
import cors from "cors";
import axios from "axios";
import xml2js from "xml2js";

const app = express();
app.use(cors());

const XML_URL = "https://i-maxi.com/ocext_yml_feed.xml";

async function fetchAndParseXML() {
	const { data } = await axios.get(XML_URL);
	return await xml2js.parseStringPromise(data);
}

app.get("/api/categories", async (req, res) => {
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

		res.json({ categories: rootCategories });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/api/products", async (req, res) => {
	try {
		const result = await fetchAndParseXML();
		const products = result?.yml_catalog?.shop?.[0]?.offers?.[0]?.offer?.map((item) => ({
			id: item.$.id,
			name: item.name?.[0] || "",
			price: item.price?.[0] || "",
			images: item.picture || [],
			categoryId: item.categoryId?.[0] || null,
		})) || [];
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
