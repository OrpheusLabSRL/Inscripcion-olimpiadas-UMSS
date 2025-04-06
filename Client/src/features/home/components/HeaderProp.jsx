import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/logo-olab.png";
import "./HeaderProp.css";
import { NextPage } from "../../../components/Buttons/NextPage";

function HeaderProp() {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <div className="header-logo">
        <img src={Logo} alt="University Logo" />
      </div>
      <h1>Oh! SanSi</h1>
      <nav>
        <ul>
          <li onClick={() => navigate("/")}>Inicio</li>
          <li>Acerca de</li>
          <li>Olimpiadas Anteriores</li>
          <li>Contacto</li>
          <li>{<NextPage value="Inscribirse" to="/register/tutor-form" />}</li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderProp;