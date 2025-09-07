import axios from "axios";
import xml2js from "xml2js";

export default async function handler(req, res) {
	try {
		const { data } = await axios.get("https://i-maxi.com/ocext_yml_feed.xml");
		const result = await xml2js.parseStringPromise(data);

		const products = result.yml_catalog.shop[0].offers[0].offer.map(p => ({
			id: p.$.id,
			name: p.name[0],
			price: p.price[0],
			categoryId: p.categoryId[0],
		}));

		res.status(200).json(products);
	} catch (err) {
		res.status(500).json({ error: "Ошибка загрузки товаров" });
	}
}
