import getCategories from "../api/categories.js";

export default async function handler(req, res) {
	return getCategories(req, res);
}
