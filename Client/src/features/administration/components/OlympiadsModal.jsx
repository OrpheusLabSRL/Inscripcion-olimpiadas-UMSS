import React, { useState } from "react";
import "../styles/ModalGeneral.css";
import "../styles/General.css";
import { createOlympiad } from "../../../api/inscription.api";

const OlympiadsModal = ({ isOpen, onClose, onSave }) => {
  const initialFormState = {
    nombreOlimpiada: "",
    version: "",
    fechaInicioOlimp: "",
    fechaFinOlimp: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const hoy = new Date().toISOString().split("T")[0];

    if (!formData.nombreOlimpiada.trim()) {
      nuevosErrores.nombreOlimpiada = "Este campo es requerido";
    }
    if (!formData.version) {
      nuevosErrores.version = "Este campo es requerido";
    }
    if (!formData.fechaInicioOlimp) {
      nuevosErrores.fechaInicioOlimp = "Este campo es requerido";
    } else if (formData.fechaInicioOlimp < hoy) {
      nuevosErrores.fechaInicioOlimp = "La fecha no puede ser pasada";
    }

    if (!formData.fechaFinOlimp) {
      nuevosErrores.fechaFinOlimp = "Este campo es requerido";
    } else if (formData.fechaFinOlimp < formData.fechaInicioOlimp) {
      nuevosErrores.fechaFinOlimp =
        "La fecha de fin no puede ser anterior a la de inicio";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const confirmacion = window.confirm(
      "¿Estás seguro de registrar esta olimpiada?"
    );
    if (!confirmacion) return;

    try {
      const payload = {
        ...formData,
        version: parseInt(formData.version),
        estadoOlimpiada: 1,
      };
      await createOlympiad(payload);
      alert("Versión registrada correctamente");
      resetForm();
      onClose();
      onSave && onSave();
    } catch (error) {
      console.error("Error al crear la olimpiada:", error);
      alert("Error al guardar la olimpiada.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="close-button" onClick={handleClose}>
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          <h2 className="modal-title">Nueva Olimpiada</h2>

          <div className="form-group">
            <label>
              Nombre de la Olimpiada <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="nombreOlimpiada"
              value={formData.nombreOlimpiada}
              onChange={handleChange}
              className={errors.nombreOlimpiada ? "input-error" : ""}
            />
            {errors.nombreOlimpiada && (
              <p className="error-message">{errors.nombreOlimpiada}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              Versión <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className={errors.version ? "input-error" : ""}
            />
            {errors.version && (
              <p className="error-message">{errors.version}</p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Fecha de Inicio <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                name="fechaInicioOlimp"
                value={formData.fechaInicioOlimp}
                onChange={handleChange}
                className={errors.fechaInicioOlimp ? "input-error" : ""}
              />
              {errors.fechaInicioOlimp && (
                <p className="error-message">{errors.fechaInicioOlimp}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                Fecha de Fin <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                name="fechaFinOlimp"
                value={formData.fechaFinOlimp}
                onChange={handleChange}
                className={errors.fechaFinOlimp ? "input-error" : ""}
              />
              {errors.fechaFinOlimp && (
                <p className="error-message">{errors.fechaFinOlimp}</p>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
            >
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
