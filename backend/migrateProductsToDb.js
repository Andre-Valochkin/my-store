import { parseStringPromise } from "xml2js";
import axios from "axios";
import pool from "./db.js";

// Ссылка на XML от поставщика
const XML_URL = "https://i-maxi.com/ocext_yml_feed.xml";

// Безопасное преобразование числа
function toNumberSafe(value, fallback = 0) {
	const num = Number(value);
	return isNaN(num) ? fallback : num;
}

// Загружаем и парсим XML
async function fetchAndParseXML(url) {
	const { data } = await axios.get(url);
	return parseStringPromise(data);
}

async function migrateProducts() {
	try {
		const result = await fetchAndParseXML(XML_URL);
		const offers = result?.yml_catalog?.shop?.[0]?.offers?.[0]?.offer || [];
		const problematicProducts = [];

		for (const item of offers) {
			const xml_id = toNumberSafe(item.$.id, null);
			if (!xml_id) continue;

			const name = (item.name?.[0] || "").trim();
			const price = toNumberSafe(item.price?.[0], 0);
			const category_id = toNumberSafe(item.categoryId?.[0], 150);
			const description = (item.description?.[0] || "").trim();

			const imagesArray = item.picture
				? Array.isArray(item.picture)
					? item.picture.map(url => url.trim())
					: [item.picture.trim()]
				: [];
			const imagesJson = JSON.stringify(imagesArray);

			if (price === 0) {
				problematicProducts.push({ xml_id, name, price, category_id });
			}

			// Вставляем товар по одному — PostgreSQL корректно определяет типы
			await pool.query(
				`INSERT INTO products (xml_id, name, price, images, category_id, description)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6)
         ON CONFLICT(xml_id) DO UPDATE
         SET name = EXCLUDED.name,
             price = EXCLUDED.price,
             images = EXCLUDED.images,
             category_id = EXCLUDED.category_id,
             description = EXCLUDED.description`,
				[xml_id, name, price, imagesJson, category_id, description]
			);
		}

		if (problematicProducts.length > 0) {
			console.warn("⚠️ Найдены проблемные товары (price=0):");
			console.table(problematicProducts);
		}

		console.log(`✅ Товары импортированы: ${offers.length}`);
		process.exit(0);

	} catch (err) {
		console.error("❌ Ошибка миграции товаров:", err);
		process.exit(1);
	}
}

migrateProducts();
