import React, { useState } from "react";
import "../styles/ModalGeneral.css";

const ModalAgregarCategoria = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreCategoria: "",
    grado: "",
    area: "",
    estado: true,
  });

  // Aquí podrías reemplazar con los datos reales que vengan de la API
  const areas = ["Matemáticas", "Lenguaje", "Ciencias"];
  const grados = ["Primero", "Segundo", "Tercero"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Agregar categoría</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la categoría</label>
            <input
              type="text"
              name="nombreCategoria"
              value={formData.nombreCategoria}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Área</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un área</option>
              {areas.map((area, index) => (
                <option key={index} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Grado</label>
            <select
              name="grado"
              value={formData.grado}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un grado</option>
              {grados.map((grado, index) => (
                <option key={index} value={grado}>
                  {grado}
                </option>
              ))}
            </select>
          </div>

          <div className="checkbox-row">
            <label htmlFor="estado">
              <span>Activo</span>
              <input
                id="estado"
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarCategoria;
