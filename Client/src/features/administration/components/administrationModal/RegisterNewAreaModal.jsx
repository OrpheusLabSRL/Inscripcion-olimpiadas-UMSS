import React, { useState } from "react";
import "../../Styles/ModalGeneral.css";
import { createArea } from "../../../../api/Administration.api";
import { toast } from "react-toastify"; // Opcional: para notificaciones más profesionales

const RegisterNewAreaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreArea: "",
    descripcionArea: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      nombreArea: "",
      descripcionArea: "",
    });
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreArea.trim()) {
      newErrors.nombreArea = "El nombre del área es obligatorio";
    } else if (formData.nombreArea.length > 50) {
      newErrors.nombreArea = "El nombre no debe exceder los 50 caracteres";
    }

    if (formData.descripcionArea.length > 200) {
      newErrors.descripcionArea =
        "La descripción no debe exceder los 200 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await createArea(formData);
      toast.success("Área registrada correctamente");
      handleReset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al registrar área:", error);
      toast.error(
        error.response?.data?.message || "No se pudo registrar el área"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleReset}>
      <div
        className="modal-content"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="section-title">Registrar Nueva Área</h3>
          <button
            className="close-button"
            onClick={handleReset}
            aria-label="Cerrar modal"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={`field-group ${errors.nombreArea ? "has-error" : ""}`}
          >
            <label htmlFor="nombreArea">
              Nombre del Área <span className="required-field">*</span>
            </label>
            <input
              id="nombreArea"
              name="nombreArea"
              type="text"
              value={formData.nombreArea}
              onChange={handleChange}
              className={`form-input ${errors.nombreArea ? "input-error" : ""}`}
              placeholder="Ej: Matematicas, Quimica, etc."
              maxLength="50"
            />
            {errors.nombreArea && (
              <p className="error-message">
                <i className="icon-warning">⚠</i> {errors.nombreArea}
              </p>
            )}
          </div>

          <div
            className={`field-group ${
              errors.descripcionArea ? "has-error" : ""
            }`}
          >
            <label htmlFor="descripcionArea">Descripción (opcional)</label>
            <textarea
              id="descripcionArea"
              name="descripcionArea"
              value={formData.descripcionArea}
              onChange={handleChange}
              className={`form-input ${
                errors.descripcionArea ? "input-error" : ""
              }`}
              placeholder="Breve descripción del área"
              maxLength="200"
              rows="3"
            />
            <div className="char-counter">
              {formData.descripcionArea.length}/200 caracteres
            </div>
            {errors.descripcionArea && (
              <p className="error-message">
                <i className="icon-warning">⚠</i> {errors.descripcionArea}
              </p>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleReset}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterNewAreaModal;
