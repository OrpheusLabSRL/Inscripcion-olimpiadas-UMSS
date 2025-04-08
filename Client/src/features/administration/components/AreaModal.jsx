import React, { useState } from "react";
import "../styles/ModalGeneral.css";
import "../styles/General.css";
import { createArea } from "../../../api/inscription.api"; // Ajustá ruta si es necesario

const AreaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombreArea: "",
    descripcionArea: "",
    costoArea: "",
    estadoArea: true,
    idOlimpiada: "1",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        costoArea: parseFloat(formData.costoArea),
        estadoArea: formData.estadoArea ? 1 : 0,
        idOlimpiada: formData.idOlimpiada,
      };
      console.log(formData);
      await createArea(payload);
      alert("Área guardada correctamente.");
      onClose();
      onSave && onSave();
    } catch (err) {
      console.error("Error al crear el área:", err);
      alert("Hubo un error al guardar el área.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="close-button" onClick={onClose}>
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          <h2 className="modal-title">Agregar área</h2>

          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombreArea"
              placeholder="Ingresa el nombre del área"
              value={formData.nombreArea}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              name="descripcionArea"
              placeholder="Describe los detalles del área"
              value={formData.descripcionArea}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Costo (Bs) *</label>
            <input
              type="number"
              name="costoArea"
              placeholder="Ingresa el costo del área"
              value={formData.costoArea}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              Activo
              <input
                type="checkbox"
                name="estadoArea"
                checked={formData.estadoArea}
                onChange={handleChange}
                style={{ width: "18px", height: "18px" }}
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

export default AreaModal;
