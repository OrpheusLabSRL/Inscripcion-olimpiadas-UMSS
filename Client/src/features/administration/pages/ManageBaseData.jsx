import React, { useState } from "react";
import Dropdown from "../components/Dropdown.jsx";
import "../Styles/General.css";

const ManageBaseData = () => {
  const [version, setVersion] = useState("");
  const [area, setArea] = useState("");
  const [matematica, setMatematica] = useState("");
  const [fisica, setFisica] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ version, area, matematica, fisica });
  };

  return (
    <div className="page-content">
      {/* Botón atrás */}
      <div style={{ marginBottom: "1rem" }}>
        <button className="back-button" onClick={() => window.history.back()}>
          ←
        </button>
      </div>

      {/* Formulario */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2 className="section-title">
            Seleccionar la Versión de la Olimpiada
          </h2>
          <Dropdown
            size="large"
            label=""
            placeholder="Seleccione las Áreas de la Olimpiada"
            options={["Versión 2025", "Versión 2026"]}
            onChange={(e) => setVersion(e.target.value)}
          />

          <p className="note">
            Nota: Si desea añadir o modificar una nueva área o categoría,
            contactarse con un administrador
          </p>

          <h3 className="section-title">Áreas de la Olimpiada</h3>
          <Dropdown
            size="large"
            label=""
            placeholder="Seleccione las Áreas de la Olimpiada"
            options={["Matemáticas", "Física"]}
            onChange={(e) => setArea(e.target.value)}
          />

          <h3 className="section-title">Categorías de la Olimpiada</h3>

          <div className="field-group">
            <label className="field-label required">Matemáticas</label>
            <Dropdown
              size="small"
              label=""
              placeholder="Seleccione la Categoría de la Área"
              options={["Primer Nivel", "Segundo Nivel", "Tercer Nivel"]}
              onChange={(e) => setMatematica(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label className="field-label required">Física</label>
            <Dropdown
              size="small"
              label=""
              placeholder="Seleccione la Categoría de la Área"
              options={["Primer Nivel", "Segundo Nivel"]}
              onChange={(e) => setFisica(e.target.value)}
            />
          </div>

          <div className="btn-container align-right">
            <button type="submit" className="btn-registrar">
              REGISTRAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageBaseData;
