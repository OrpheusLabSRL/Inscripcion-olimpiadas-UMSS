import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import "../../styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { createArea, getAreas } from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const RegisterNewAreaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreArea: "",
    descripcionArea: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAreas, setExistingAreas] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getAreas()
        .then((data) => {
          setExistingAreas(data || []);
        })
        .catch((error) => {
          console.error("Error al obtener áreas existentes:", error);
        });
    }
  }, [isOpen]);

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
    const nombre = formData.nombreArea.trim();
    const descripcion = formData.descripcionArea.trim();

    if (!nombre) {
      newErrors.nombreArea = "El nombre del área es obligatorio";
    } else if (nombre.length > 50) {
      newErrors.nombreArea = "El nombre no debe exceder los 50 caracteres";
    } else if (
      existingAreas.some(
        (a) => a.nombreArea.trim().toLowerCase() === nombre.toLowerCase()
      )
    ) {
      newErrors.nombreArea = "Ya existe un área con ese nombre";
    }

    if (!descripcion) {
      newErrors.descripcionArea = "La descripción del área es obligatoria";
    } else if (descripcion.length > 200) {
      newErrors.descripcionArea =
        "La descripción solo debe tener 200 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      await MySwal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Se deben llenar todos los campos obligatorios correctamente.",
      });
      return;
    }

    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas registrar esta nueva área?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        container: "swal2-container",
      },
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      await createArea({
        nombreArea: formData.nombreArea.trim().toUpperCase(),
        descripcionArea: formData.descripcionArea.trim(),
      });

      await MySwal.fire({
        icon: "success",
        title: "¡Área registrada!",
        text: "La nueva área ha sido registrada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          container: "swal2-container",
        },
      });

      handleReset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al registrar área:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo registrar el área",
        customClass: {
          container: "swal2-container",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={handleReset}>
      <div
        className="admin-modal-content"
        style={{ maxWidth: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="admin-modal-close-btn"
          onClick={handleReset}
          aria-label="Cerrar modal"
        >
          ✖
        </button>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Registrar Nueva Área</h3>
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
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-modal-btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterNewAreaModal;
