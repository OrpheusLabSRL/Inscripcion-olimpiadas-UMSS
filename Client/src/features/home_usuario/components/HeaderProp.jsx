import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/ohsansi.jpg";
import "../Styles/HeaderProp.css";

function HeaderProp() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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

        <nav className={`headerNav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => { navigate("/"); closeMenu(); }}>
              <i className="bi bi-house"></i> Inicio
            </li>
            <li onClick={() => { navigate("/consultar-inscripcion"); closeMenu(); }}>
              <i className="bi bi-clipboard-check"></i> Estado de Inscripcion
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
