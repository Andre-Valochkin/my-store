import { API_BASE } from "../../../config";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CategoriesSidebar.css";

const CategoriesSidebar = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки категорий:", err);
        setLoading(false);
      });
  }, []);

  // Блокировка скролла страницы, кроме меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenCategory(null); // 🔥 сбрасываем подкатегории
  };

  return (
    <div className="categories-dropdown">
      <button
        className="dropdown-toggle"
        onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
      >
        КАТЕГОРИИ {menuOpen ? "▲" : "▼"}
      </button>

      {menuOpen && (
        <>
          <div className="dropdown-menu">
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <div className="dropdown-categories">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-item ${
                      openCategory === cat.id ? "active" : ""
                    }`}
                  >
                    {!cat.subcategories || cat.subcategories.length === 0 ? (
                      <Link
                        to={`/category/${cat.id}`}
                        className="category-link"
                        onClick={() => {
                          onSelectCategory(cat.id);
                          closeMenu(); // 🔥 сбрасываем меню и подкатегории
                        }}
                      >
                        {cat.name}
                      </Link>
                    ) : (
                      <div
                        className="category-link"
                        onClick={() => toggleCategory(cat.id)}
                      >
                        {cat.name}
                        <span
                          className={`arrow ${
                            openCategory === cat.id ? "open" : ""
                          }`}
                        >
                          ▶
                        </span>
                      </div>
                    )}

                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div
                        className={`submenu ${
                          openCategory === cat.id ? "open" : ""
                        }`}
                      >
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/category/${sub.id}`}
                            className="submenu-item"
                            onClick={() => {
                              onSelectCategory(sub.id);
                              closeMenu(); // 🔥 сбрасываем меню и подкатегории
                            }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="overlay" onClick={closeMenu}></div>
        </>
      )}
    </div>
  );
};

export default CategoriesSidebar;
