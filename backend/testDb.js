import pool from "./db.js";

(async () => {
	try {
		// Пробуем выполнить простой запрос к базе
		const res = await pool.query("SELECT NOW()");
		console.log("✅ Подключение успешно! Время на сервере:", res.rows[0]);
	} catch (err) {
		console.error("❌ Ошибка подключения:", err.message);
	} finally {
		await pool.end(); // закрываем соединение
	}
})();
