import "./CategoryPage.css";
import { API_BASE } from "../../config";
import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../main-page/product-card/ProductCard";

const fetchProducts = async () => {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
};

const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Ошибка загрузки категорий");
  return res.json();
};

const CategoryPage = ({ categoryId: categoryIdFromProps }) => {
  const params = useParams();
  const categoryId = categoryIdFromProps ?? params.categoryId ?? "all";

  const [visibleCount, setVisibleCount] = useState(12);

  // Сбрасываем количество видимых товаров при смене категории
  useEffect(() => {
    setVisibleCount(12);
  }, [categoryId]);

  const {
    data: productsData = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const {
    data: categoriesData = { categories: [] },
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const categories = useMemo(
    () => categoriesData.categories || [],
    [categoriesData.categories]
  );

  const filteredProducts = useMemo(() => {
    if (!productsData.length || !categories.length) return [];

    if (categoryId === "all") return [...productsData];

    const findCategory = (cats) => {
      for (const cat of cats) {
        if (String(cat.id) === String(categoryId)) return cat;
        if (cat.subcategories) {
          const sub = findCategory(cat.subcategories);
          if (sub) return sub;
        }
      }
      return null;
    };

    const selectedCat = findCategory(categories);
    if (!selectedCat) return [];

    const collectCategoryIds = (cat) => {
      let ids = [cat.id];
      if (cat.subcategories?.length) {
        for (const sub of cat.subcategories) {
          ids = ids.concat(collectCategoryIds(sub));
        }
      }
      return ids;
    };

    const idsToFilter = collectCategoryIds(selectedCat);

    return productsData.filter(
      (p) =>
        p.categoryId && idsToFilter.map(String).includes(String(p.categoryId))
    );
  }, [productsData, categories, categoryId]);

  const categoryTitle = useMemo(() => {
    if (categoryId === "all") return "Все товары";

    // Ищем выбранную категорию (может быть подкатегория)
    const findCategoryPath = (cats, targetId, path = []) => {
      for (const cat of cats) {
        if (String(cat.id) === String(targetId)) return [...path, cat.name];
        if (cat.subcategories) {
          const subPath = findCategoryPath(cat.subcategories, targetId, [
            ...path,
            cat.name,
          ]);
          if (subPath) return subPath;
        }
      }
      return null;
    };

    const path = findCategoryPath(categories, categoryId);
    if (!path) return "Категория";

    // Соединяем путь стрелочкой
    return path.join(" → ");
  }, [categories, categoryId]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleShowMore = () => setVisibleCount((prev) => prev + 12);

  if (productsLoading || categoriesLoading) return <p>Загрузка...</p>;
  if (productsError || categoriesError) return <p>Ошибка загрузки данных</p>;
  if (!filteredProducts.length) return <p>Товары не найдены</p>;

  return (
    <div>
      <div className="categoryPage-title-block">
        <h1>{categoryTitle}</h1>
      </div>
      <div className="categoryPage-products-block">
        {visibleProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {visibleCount < filteredProducts.length && (
        <div>
          <button
            className="categoryPage-show-more-btn"
            onClick={handleShowMore}
          >
            Показать еще
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
