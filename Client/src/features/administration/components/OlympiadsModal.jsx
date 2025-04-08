import React, { useState } from "react";
import "../styles/ModalGeneral.css";
import "../styles/General.css";
import { createOlympiad } from "../../../api/inscription.api";

const OlympiadsModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombreOlimpiada: "",
    version: "",
    //descripcion: "",
    fechaInicioOlimp: "",
    fechaFinOlimp: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        version: parseInt(formData.version),
        estadoOlimpiada: 1,
      };
      console.log("Enviando datos:", formData);
      await createOlympiad(payload);
      alert("¡Olimpiada guardada exitosamente!");
      onClose();
      onSave && onSave(); // Si se pasa una función onSave, la ejecutamos (ej: para refrescar tabla)
    } catch (error) {
      console.error("Error al crear la olimpiada:", error);
      alert("Error al guardar la olimpiada.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="close-button" onClick={onClose}>
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          <h2 className="modal-title">Nueva Olimpiada</h2>

          <div className="form-group">
            <label>Nombre de la Olimpiada *</label>
            <input
              type="text"
              name="nombreOlimpiada"
              value={formData.nombreOlimpiada}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gestión *</label>
            <input
              type="number"
              name="version"
              value={formData.version}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Inicio *</label>
              <input
                type="date"
                name="fechaInicioOlimp"
                value={formData.fechaInicioOlimp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha de Fin *</label>
              <input
                type="date"
                name="fechaFinOlimp"
                value={formData.fechaFinOlimp}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Guardar Olimpiada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OlympiadsModal;
