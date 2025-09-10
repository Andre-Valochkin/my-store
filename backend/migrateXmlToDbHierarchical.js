import { fetchAndParseXML } from "./utils/xmlParser.js";
import pool from "./db.js";

const XML_URL = "https://i-maxi.com/ocext_yml_feed.xml";

async function migrate() {
	try {
		const result = await fetchAndParseXML(XML_URL);

		// ---- Миграция категорий ----
		const categoriesXml = result?.yml_catalog?.shop?.[0]?.categories?.[0]?.category || [];
		const categoryMap = {};

		for (let cat of categoriesXml) {
			const id = parseInt(cat.$.id);
			const parentId = cat.$.parentId ? parseInt(cat.$.parentId) : null;
			const name = (cat._ || "").trim();

			categoryMap[id] = { id, name, parent_id: parentId };

			await pool.query(
				`INSERT INTO categories(id, name, parent_id)
         VALUES($1, $2, $3)
         ON CONFLICT(id) DO NOTHING`,
				[id, name, parentId]
			);
		}

		console.log(`✅ Категории импортированы: ${Object.keys(categoryMap).length}`);

		// ---- Миграция товаров ----
		const offers = result?.yml_catalog?.shop?.[0]?.offers?.[0]?.offer || [];

		for (let item of offers) {
			const id = parseInt(item.$.id);
			const name = item.name?.[0] || "";
			const price = parseFloat(item.price?.[0]) || 0;
			const images = item.picture || [];
			let categoryId = parseInt(item.categoryId?.[0]);

			// fallback: если категории нет в базе, ставим "ВСЕ ТОВАРЫ" (например id=150)
			if (!categoryMap[categoryId]) {
				categoryId = 150;
			}

			await pool.query(
				`INSERT INTO products(id, name, price, images, category_id)
         VALUES($1, $2, $3, $4, $5)
         ON CONFLICT(id) DO UPDATE
         SET name=$2, price=$3, images=$4, category_id=$5`,
				[id, name, price, images, categoryId]
			);
		}

		console.log(`✅ Товары импортированы: ${offers.length}`);
		process.exit(0);
	} catch (err) {
		console.error("❌ Ошибка миграции:", err);
		process.exit(1);
	}
}

migrate();
