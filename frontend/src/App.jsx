import Header from "./components/header/Header";
import CategoryPage from "./components/main-page/CategoryPage";
import { Routes, Route } from "react-router-dom";

import "./App.css";

const App = () => {
  return (
    <>
      <Header />
      <div className="container">
        <h1>YAhoooooooooooo....................</h1>
        <Routes>
          {/* Главная = все товары */}
          <Route path="/" element={<CategoryPage categoryId="all" />} />
          {/* Категории */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
