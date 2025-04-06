import React from "react";
import "./TutorForm.css";

export const TutorForm = () => {
  return (
    <div className="tutor-form-container">
      <h1>Proceso de Inscripción</h1>
      <p className="form-description">Inicia una nueva inscripción o continua si ya empezaste una</p>
      
      <div className="form-section">
        <h2>Nueva inscripción</h2>
        <ul className="form-options">
          <li>Continuar inscripción</li>
        </ul>

        <div className="form-grid">
          <div className="form-group">
            <label>Nombre *</label>
            <input type="text" placeholder="Ingrese su nombre" />
          </div>
          <div className="form-group">
            <label>Apellido *</label>
            <input type="text" placeholder="Ingrese su apellido" />
          </div>
        </div>

        <div className="form-group">
          <label>Tipo de Tutor *</label>
          <select>
            <option value="">Seleccione tipo de tutor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Carnet de identidad *</label>
          <input type="text" placeholder="Ingrese su carnet de identidad" />
        </div>

        <div className="form-group">
          <label>Correo Electrónico *</label>
          <input type="email" placeholder="Ingrese su correo electrónico" />
        </div>
      </div>

      <button className="submit-button">Iniciar Nueva Inscripción</button>
    </div>
  );
};