import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/ohsansi.png";
import "../Styles/HeaderProp.css";

function HeaderProp() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownVisible(false);
  };

  return (
    <header className="headerContainer">
      <div className="headerContent">
        <div className="headerLeft" onClick={() => navigate("/")}>
          <img src={Logo} alt="University Logo" className="headerLogo" />
          <h2>O!Sansi</h2>
        </div>

        <button
          className="menuButton"
          onClick={toggleMenu}
          aria-label="Open or close menu"
        >
          ☰
        </button>

        <nav className={`navigationMenu ${menuOpen ? "menuOpen" : ""}`}>
          <ul className="navigationList">
            <li onClick={() => { navigate("/"); closeMenu(); }}>
              <i className="bi bi-house"></i> Inicio
            </li>

            <li
              className="dropdownMenu"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              <span>
                <i className="bi bi-journal"></i> Mis Inscripciones ▾
              </span>

              {dropdownVisible && (
                <ul className="dropdownSubmenu">
                  <li onClick={() => { navigate("/consultar-inscripcion"); closeMenu(); }}>
                    <i className="bi bi-clipboard-check"></i> Estado de Inscripción
                  </li>
                  <li onClick={() => { navigate("/register/tutor-form"); closeMenu(); }}>
                    <i className="bi bi-clipboard-check"></i> Continuar Inscripción
                  </li>
                </ul>
              )}
            </li>

            <li onClick={() => { navigate("/contacto"); closeMenu(); }}>
              <i className="bi bi-telephone"></i> Contacto
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderProp;
