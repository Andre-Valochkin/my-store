import { useState } from "react";
import BreadCrumbs from "../bread-crumbs/BreadCrumbs";
import "./Header.css";

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  return (
    <header className="header">
      <div className="header-wrapper">
        <div className="header-block">
          <div className="header-logo">
            <img
              className="header-logo__img"
              src="../../../public/potribna-rich-logo.png"
              alt="Logo"
            />
          </div>
          <div>корзина</div>
          <nav className="header-nav">
            <ul className={`header-list ${menuActive ? "active" : ""}`}>
              <li className="header-item">Доставка</li>
              <li className="header-item">Оплата</li>
              <li className="header-item">Контакты</li>
            </ul>
            <div className="burger" onClick={() => setMenuActive(!menuActive)}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </nav>
        </div>
      </div>
      <BreadCrumbs />
    </header>
  );
};

export default Header;
