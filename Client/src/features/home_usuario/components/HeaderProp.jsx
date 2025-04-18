import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";
import "../Styles/HeaderProp.css";
import { NextPage } from "../../../components/Buttons/NextPage";

function HeaderProp() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Función para cambiar el estado del menú
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <img src={Logo} alt="University Logo" className="header-logo" />
        <h1 className="header-title">O! SanSi</h1>
      </div>
      <div className="mobile-menu" onClick={toggleMenu}>
        ☰
      </div>
      <nav>
        <ul className={`header-nav ${menuOpen ? "show" : ""}`}>
          <li onClick={() => navigate("/")}>Inicio</li>
          <li>Acerca de</li>
          <li>Olimpiadas Anteriores</li>
          <li>Contacto</li>
          <li><NextPage value="Inscribirse" to="/register/tutor-form" /></li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderProp;
