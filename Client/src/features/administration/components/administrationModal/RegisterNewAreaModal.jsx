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
    <div className="adminModalOverlay" onClick={handleReset}>
      <div
        className="adminModalContent"
        style={{ maxWidth: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="adminModalCloseBtn"
          onClick={handleReset}
          aria-label="Cerrar modal"
        >
          ✖
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Registrar Nueva Área</h3>
        </div>

        <form onSubmit={handleSubmit} className="adminModalForm">
          <div className="adminFormGroup">
            <label htmlFor="nombreArea" className="adminFormLabel">
              Nombre del Área <span className="adminRequiredField">*</span>
            </label>
            <input
              id="nombreArea"
              name="nombreArea"
              type="text"
              value={formData.nombreArea}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.nombreArea ? "adminInputError" : ""
              }`}
              placeholder="Ej: Matemáticas, Química, etc."
              maxLength="50"
              disabled={isSubmitting}
            />
            {errors.nombreArea && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.nombreArea}
              </p>
            )}
          </div>

          <div className="adminFormGroup">
            <label htmlFor="descripcionArea" className="adminFormLabel">
              Descripción del Área <span className="adminRequiredField">*</span>
            </label>
            <textarea
              id="descripcionArea"
              name="descripcionArea"
              value={formData.descripcionArea}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.descripcionArea ? "adminInputError" : ""
              }`}
              placeholder="Breve descripción del área"
              maxLength="200"
              rows="3"
              disabled={isSubmitting}
            />
            <div className="adminCharCounter">
              {formData.descripcionArea.length}/200 caracteres
            </div>
            {errors.descripcionArea && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.descripcionArea}
              </p>
            )}
          </div>

          <div className="adminModalActions">
            <button
              type="button"
              className="adminModalBtnCancel"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="adminModalBtnSave"
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
