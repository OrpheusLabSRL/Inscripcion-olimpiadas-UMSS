import React, { useState, useEffect } from "react";
import "../../Styles/ModalGeneral.css";
import "../../styles/General.css";
import {
  createOlympiad,
  getOlimpiadas,
} from "../../../../api/Administration.api";

const RegisterOlympiadsModal = ({ isOpen, onClose, onSave }) => {
  const initialFormState = {
    nombreOlimpiada: "",
    version: "",
    fechaInicioOlimpiada: "",
    fechaFinOlimpiada: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [olympiads, setOlympiads] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchOlympiads();
    }
  }, [isOpen]);

  const fetchOlympiads = async () => {
    try {
      const data = await getOlimpiadas();
      setOlympiads(data.data || []);
    } catch (error) {
      console.error("Error al cargar olimpiadas:", error);
    }
  };

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

    if (name === "fechaInicioOlimpiada" || name === "fechaFinOlimpiada") {
      validarFechas(
        name === "fechaInicioOlimpiada" ? value : formData.fechaInicioOlimpiada,
        name === "fechaFinOlimpiada" ? value : formData.fechaFinOlimpiada
      );
    }
  };

  const validarFechas = (fechaInicio, fechaFin) => {
    const hoy = new Date().toISOString().split("T")[0];
    const nuevosErrores = { ...errors };

    if (fechaInicio && fechaInicio < hoy) {
      nuevosErrores.fechaInicioOlimpiada =
        "La fecha de inicio no puede ser pasada";
    } else {
      delete nuevosErrores.fechaInicioOlimpiada;
    }

    if (fechaFin && fechaFin < hoy) {
      nuevosErrores.fechaFinOlimpiada = "La fecha de fin no puede ser pasada";
    } else {
      delete nuevosErrores.fechaFinOlimpiada;
    }

    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      nuevosErrores.fechaFinOlimpiada =
        "La fecha de fin no puede ser anterior a la de inicio";
    }

    setErrors(nuevosErrores);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreOlimpiada.trim()) {
      nuevosErrores.nombreOlimpiada = "Este campo es requerido";
    }
    if (!formData.version) {
      nuevosErrores.version = "Este campo es requerido";
    }
    if (!formData.fechaInicioOlimpiada) {
      nuevosErrores.fechaInicioOlimpiada = "Este campo es requerido";
    }
    if (!formData.fechaFinOlimpiada) {
      nuevosErrores.fechaFinOlimpiada = "Este campo es requerido";
    }

    validarFechas(formData.fechaInicioOlimpiada, formData.fechaFinOlimpiada);

    const existe = olympiads.some(
      (o) =>
        o.nombreOlimpiada.trim().toLowerCase() ===
          formData.nombreOlimpiada.trim().toLowerCase() &&
        parseInt(o.version) === parseInt(formData.version)
    );

    if (existe) {
      nuevosErrores.nombreOlimpiada =
        "Ya existe una olimpiada con este nombre y versión";
      nuevosErrores.version =
        "Ya existe una olimpiada con este nombre y versión";
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
        estadoOlimpiada: 0,
        idUsuario: 1,
      };

      await createOlympiad(payload);

      alert("Versión registrada correctamente");
      resetForm();
      onClose();
      onSave && onSave();
      window.location.reload();
    } catch (error) {
      console.error("Error al crear la olimpiada:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Error inesperado al guardar la olimpiada.");
      }
    }
  };

  if (!isOpen) return null;

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
                name="fechaInicioOlimpiada"
                value={formData.fechaInicioOlimpiada}
                onChange={handleChange}
                className={errors.fechaInicioOlimpiada ? "input-error" : ""}
              />
              {errors.fechaInicioOlimpiada && (
                <p className="error-message">{errors.fechaInicioOlimpiada}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                Fecha de Fin <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                name="fechaFinOlimpiada"
                value={formData.fechaFinOlimpiada}
                onChange={handleChange}
                className={errors.fechaFinOlimpiada ? "input-error" : ""}
              />
              {errors.fechaFinOlimpiada && (
                <p className="error-message">{errors.fechaFinOlimpiada}</p>
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

export default RegisterOlympiadsModal;
