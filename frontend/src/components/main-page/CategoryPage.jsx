import "./CategoryPage.css";

import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../main-page/product-card/ProductCard";

const fetchProducts = async () => {
  const res = await fetch("http://localhost:3000/api/products");
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
};

const fetchCategories = async () => {
  const res = await fetch("http://localhost:3000/api/categories");
  if (!res.ok) throw new Error("Ошибка загрузки категорий");
  return res.json();
};

const CategoryPage = (props) => {
  const params = useParams();
  const categoryIdFromProps = props.categoryId; // "all" на главной
  const categoryId = categoryIdFromProps || params.categoryId;

  const [visibleCount, setVisibleCount] = useState(12);
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Категория");

  const {
    data: productsData = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const {
    data: categoriesData = { categories: [] },
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories = useMemo(
    () => categoriesData.categories || [],
    [categoriesData.categories?.length]
  );

  useEffect(() => {
    if (!productsData.length || !categories.length) return;

    let filteredProducts = [];
    let catName = "Категория";

    if (!categoryId || categoryId === "all") {
      // 🚀 Всегда все товары (и на главной, и при клике на "все товары")
      catName = "Все товары";
      filteredProducts = [...productsData];
    } else {
      // Обычная категория
      filteredProducts = productsData.filter(
        (p) => String(p.categoryId) === String(categoryId)
      );

      // Определяем название категории
      categories.forEach((cat) => {
        if (String(cat.id) === String(categoryId)) catName = cat.name;
        if (cat.subcategories) {
          const sub = cat.subcategories.find(
            (s) => String(s.id) === String(categoryId)
          );
          if (sub) catName = `${cat.name} → ${sub.name}`;
        }
      });
    }

    setCategoryName(catName);

    // Перемешиваем только для "все товары"
    const shuffled =
      !categoryId || categoryId === "all"
        ? [...filteredProducts].sort(() => Math.random() - 0.5)
        : filteredProducts;

    setShuffledProducts(shuffled);
    setVisibleCount(12); // сбрасываем счетчик при смене категории
  }, [productsData, categories, categoryId]);

  const handleShowMore = () => setVisibleCount((prev) => prev + 12);

  if (productsLoading || categoriesLoading) return <p>Загрузка...</p>;
  if (productsError || categoriesError) return <p>Ошибка загрузки данных</p>;
  if (!shuffledProducts.length) return <p>Товары не найдены</p>;

  return (
    <div>
      <div className="categoryPage-title-block">
        <h1>{categoryName}</h1>
      </div>
      <div className="categoryPage-products-block">
        {shuffledProducts.slice(0, visibleCount).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}

        {visibleCount < shuffledProducts.length && (
          <button
            onClick={handleShowMore}
            className="categoryPage-show-more-btn"
          >
            Показать ещё
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
