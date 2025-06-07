import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/ohsansi.jpg";
import "../Styles/HeaderProp.css";
import { NextPage } from "../../../components/Buttons/NextPage";

function HeaderProp() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const alternarMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="contenedorEncabezado">
      <div className="contenidoEncabezado">
        <div className="encabezadoIzquierdo" onClick={() => navigate("/")}>
          <img src={Logo} alt="Logotipo Universidad" className="logoEncabezado" />
          <h2>O!Sansi</h2>
        </div>

        <button
          className="botonMenu"
          onClick={alternarMenu}
          aria-label="Abrir o cerrar menú"
        >
          ☰
        </button>

        <nav className={`navegacionEncabezado ${menuAbierto ? "abierto" : ""}`}>
          <ul>
            <li onClick={() => { navigate("/"); cerrarMenu(); }}>
              <i className="bi bi-house"></i> Inicio
            </li>
            <li onClick={() => { navigate("/consultar-inscripcion"); cerrarMenu(); }}>
              <i className="bi bi-clipboard-check"></i> Estado de inscripción
            </li>
            <li onClick={() => { navigate("/contacto"); cerrarMenu(); }}>
              <i className="bi bi-telephone"></i> Contacto
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderProp;
