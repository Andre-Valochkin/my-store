import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const { rows } = await pool.query("SELECT id, name, parent_id FROM categories");

		const categoriesMap = {};
		const rootCategories = [];

		rows.forEach((cat) => {
			const categoryObj = { id: cat.id, name: cat.name, subcategories: [] };
			categoriesMap[cat.id] = categoryObj;

			if (cat.parent_id) {
				if (categoriesMap[cat.parent_id]) {
					categoriesMap[cat.parent_id].subcategories.push(categoryObj);
				} else {
					categoriesMap[cat.parent_id] = { id: cat.parent_id, name: "", subcategories: [categoryObj] };
				}
			} else {
				rootCategories.push(categoryObj);
			}
		});

		res.json({ categories: rootCategories });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
