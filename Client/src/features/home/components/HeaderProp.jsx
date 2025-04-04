import React from "react";
import Logo from "../../../assets/images/logo-olab.png"; // Importing the university logo
import "./HeaderProp.css"; // Importing styles for the header
import { NextPage } from "../../../components/Buttons/NextPage";

function HeaderProp() {
  return (
    <header>
      <div className="header-logo">
        <img src={Logo} alt="University Logo" />
      </div>
      <h1>Oh! SanSi</h1>
      <nav>
        <ul>
          <li>Inicio</li>
          <li>Acerca de</li>
          <li>Olimpiadas Anteriores</li>
          <li>Contacto</li>
          <li>{<NextPage value="Incribirse" to="/register" />}</li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderProp;
