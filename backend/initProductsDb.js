import pool from "./db.js";

async function initProductsDb() {
	try {
		// Удаляем старую таблицу (если есть)
		await pool.query(`DROP TABLE IF EXISTS products CASCADE;`);

		// Создаём новую таблицу
		await pool.query(`
      CREATE TABLE products (
       id SERIAL PRIMARY KEY,
xml_id INT UNIQUE NOT NULL,
name TEXT NOT NULL,
price NUMERIC DEFAULT 0,
category_id INT,
images JSONB DEFAULT '[]',
description TEXT
      );
    `);

		console.log("✅ Таблица products создана заново (xml_id как уникальный ключ, images = JSONB)2");
		process.exit(0);
	} catch (error) {
		console.error("❌ Ошибка при создании таблицы products:", error);
		process.exit(1);
	}
}

initProductsDb();
