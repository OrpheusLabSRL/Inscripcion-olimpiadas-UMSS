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
        customClass: { container: "swal2Container" },
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
      customClass: { container: "swal2Container" },
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
        customClass: { container: "swal2Container" },
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error al actualizar área:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el área.",
        customClass: { container: "swal2Container" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="adminModalOverlay" onClick={handleClose}>
      <div
        className="adminModalContent"
        style={{ maxWidth: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="adminModalCloseBtn"
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          ✖
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Editar Área</h3>
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
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="adminModalBtnSave"
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
