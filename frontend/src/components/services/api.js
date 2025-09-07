// Загружаем все товары
export async function fetchProducts() {
	const res = await fetch("/api/products");
	if (!res.ok) {
		throw new Error("Ошибка загрузки товаров");
	}
	return res.json();
}

// Загружаем все категории
export async function fetchCategories() {
	const res = await fetch("/api/categories");
	if (!res.ok) {
		throw new Error("Ошибка загрузки категорий");
	}
	return res.json();
}