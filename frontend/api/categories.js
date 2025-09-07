import axios from "axios";
import xml2js from "xml2js";

export default async function handler(req, res) {
	try {
		const { data } = await axios.get("https://i-maxi.com/ocext_yml_feed.xml");
		const result = await xml2js.parseStringPromise(data);

		const categories = result.yml_catalog.shop[0].categories[0].category.map(c => ({
			id: c.$.id,
			name: c._,
		}));

		res.status(200).json(categories);
	} catch (err) {
		res.status(500).json({ error: "Ошибка загрузки категорий" });
	}
}
