import "./BreadCrumbs.css";
import CategoriesSidebar from "./сategories-sidebar/CategoriesSidebar";

const BreadCrumbs = () => {
  const handleSelectCategory = (categoryId) => {
    console.log("Выбрана категория:", categoryId);
  };

  return (
    <div className="bread-crumbs">
      <div className="bread-crumbs__wrapper">
        <CategoriesSidebar onSelectCategory={handleSelectCategory} />
      </div>
    </div>
  );
};

export default BreadCrumbs;
