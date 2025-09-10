import pool from "./db.js";

(async () => {
	try {
		await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY,
        name TEXT NOT NULL,
        parent_id INT REFERENCES categories(id)
      );
    `);

		await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC(10,2),
        images TEXT[],
        category_id INT REFERENCES categories(id)
      );
    `);

		console.log("✅ Таблицы созданы (если их ещё не было)");
	} catch (err) {
		console.error("❌ Ошибка создания таблиц:", err.message);
	} finally {
		await pool.end();
	}
})();
