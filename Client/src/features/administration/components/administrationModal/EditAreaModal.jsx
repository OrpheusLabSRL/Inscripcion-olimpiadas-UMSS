import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../styles/ModalGeneral.css";
import { updateArea } from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const EditAreaModal = ({ isOpen, onClose, area, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreArea: "",
    descripcionArea: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && area) {
      setFormData({
        nombreArea: area.nombreArea || "",
        descripcionArea: area.descripcionArea || "",
      });
      setErrors({});
    }
  }, [isOpen, area]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const nombre = formData.nombreArea.trim();
    const descripcion = formData.descripcionArea.trim();

    if (!nombre) {
      newErrors.nombreArea = "El nombre del área es obligatorio";
    } else if (nombre.length > 50) {
      newErrors.nombreArea = "No debe exceder los 50 caracteres";
    }

    if (!descripcion) {
      newErrors.descripcionArea = "La descripción es obligatoria";
    } else if (descripcion.length > 200) {
      newErrors.descripcionArea = "Máximo 200 caracteres permitidos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setErrors({});
    setFormData({
      nombreArea: "",
      descripcionArea: "",
    });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      await MySwal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos correctamente.",
        customClass: { container: "swal2-container" },
      });
      return;
    }

    const result = await MySwal.fire({
      title: "¿Guardar cambios?",
      text: "¿Deseas actualizar los datos del área?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "swal2-container" },
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      await updateArea(area.idArea, {
        nombreArea: formData.nombreArea.trim().toUpperCase(),
        descripcionArea: formData.descripcionArea.trim(),
      });

      await MySwal.fire({
        icon: "success",
        title: "Actualizado",
        text: "El área se actualizó correctamente.",
        timer: 1800,
        showConfirmButton: false,
        customClass: { container: "swal2-container" },
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error al actualizar área:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el área.",
        customClass: { container: "swal2-container" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={handleClose}>
      <div
        className="admin-modal-content"
        style={{ maxWidth: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="admin-modal-close-btn"
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          ✖
        </button>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Editar Área</h3>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-form-group">
            <label htmlFor="nombreArea" className="admin-form-label">
              Nombre del Área <span className="admin-required-field">*</span>
            </label>
            <input
              id="nombreArea"
              name="nombreArea"
              type="text"
              value={formData.nombreArea}
              onChange={handleChange}
              className={`admin-form-input ${
                errors.nombreArea ? "admin-input-error" : ""
              }`}
              placeholder="Ej: Matemáticas, Química, etc."
              maxLength="50"
              disabled={isSubmitting}
            />
            {errors.nombreArea && (
              <p className="admin-error-message">
                <FiAlertCircle /> {errors.nombreArea}
              </p>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="descripcionArea" className="admin-form-label">
              Descripción del Área{" "}
              <span className="admin-required-field">*</span>
            </label>
            <textarea
              id="descripcionArea"
              name="descripcionArea"
              value={formData.descripcionArea}
              onChange={handleChange}
              className={`admin-form-input ${
                errors.descripcionArea ? "admin-input-error" : ""
              }`}
              placeholder="Breve descripción del área"
              maxLength="200"
              rows="3"
              disabled={isSubmitting}
            />
            <div className="admin-char-counter">
              {formData.descripcionArea.length}/200 caracteres
            </div>
            {errors.descripcionArea && (
              <p className="admin-error-message">
                <FiAlertCircle /> {errors.descripcionArea}
              </p>
            )}
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-modal-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-modal-btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAreaModal;
