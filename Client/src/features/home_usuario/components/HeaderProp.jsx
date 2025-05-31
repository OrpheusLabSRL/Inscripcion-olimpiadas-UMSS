import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/ohsansi.jpg";
import "../Styles/HeaderProp.css";
import { NextPage } from "../../../components/Buttons/NextPage";

function HeaderProp() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-left" onClick={() => navigate("/")}>
          <img src={Logo} alt="University Logo" className="header-logo" />
          <h2>O!Sansi</h2>
        </div>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Abrir o cerrar menú"
        >
          ☰
        </button>

        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => { navigate("/"); closeMenu(); }}>
              <i className="bi bi-house"></i> Inicio
            </li>
            <li onClick={() => { navigate("/consultar-inscripcion"); closeMenu(); }}>
              <i className="bi bi-clipboard-check"></i> Estado de inscripción
            </li>
            <li onClick={() => { navigate("/contacto"); closeMenu(); }}>
              <i className="bi bi-telephone"></i> Contacto
            </li>
            {/* <li onClick={() => { navigate("/register/tutor-form");
                closeMenu();
              }}
              className="header-nav-item inscribirse-item"
            >
              <i className="bi bi-person-plus"></i> Inscribirse
            </li> */}

          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderProp;
