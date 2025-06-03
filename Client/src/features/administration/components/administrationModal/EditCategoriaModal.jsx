import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import MultiSelectDropdown from "../../components/MultiSelectDropdown.jsx";
import "../../styles/Dropdown.css";
import "../../styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  updateCategoriaWithGrados,
  getGrados,
} from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const EditCategoriaModal = ({ isOpen, onClose, categoria, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreCategoria: "",
    grados: [],
  });
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && categoria) {
      const fetchData = async () => {
        try {
          const gradosResponse = await getGrados();

          // Debug: Verificar estructura de datos
          console.log("Grados disponibles:", gradosResponse);
          console.log("Datos de categoría recibidos:", categoria);

          setGradosDisponibles(gradosResponse || []);

          // SOLUCIÓN PRINCIPAL: Usar categoria.grados en lugar de categoria.rawData
          const gradosActuales = Array.isArray(categoria.grados)
            ? categoria.grados
            : [];

          console.log("IDs de grados actuales:", gradosActuales);
          console.log(
            "IDs de grados disponibles:",
            gradosResponse.map((g) => g.idGrado)
          );

          setFormData({
            nombreCategoria: categoria.nombreCategoria || "",
            grados: gradosActuales, // Esto ahora debería ser [3, 2] según tus logs
          });
          setErrors({});
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
      };

      fetchData();
    } else {
      // Resetear el formulario cuando el modal se cierra
      setFormData({
        nombreCategoria: "",
        grados: [],
      });
      setErrors({});
    }
  }, [isOpen, categoria]);

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

  const handleGradosChange = (selectedGrados) => {
    // Asegurar que los valores son números (consistentes con la API)
    const gradosNumericos = selectedGrados.map(Number);

    setFormData((prev) => ({
      ...prev,
      grados: gradosNumericos,
    }));

    setErrors((prev) => ({
      ...prev,
      grados: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nombre = formData.nombreCategoria.trim();

    if (!nombre) {
      newErrors.nombreCategoria = "El nombre de la categoría es obligatorio";
    } else if (nombre.length > 50) {
      newErrors.nombreCategoria = "No debe exceder los 50 caracteres";
    }

    if (formData.grados.length === 0) {
      newErrors.grados = "Debe seleccionar al menos un grado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setFormData({
      nombreCategoria: "",
      grados: [],
    });
    setErrors({});
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
      text: "¿Deseas actualizar los datos de la categoría?",
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
      await updateCategoriaWithGrados(categoria.idCategoria, {
        nombreCategoria: formData.nombreCategoria.trim().toUpperCase(),
        grados: formData.grados,
        estadoCategoriaGrado: true,
      });

      await MySwal.fire({
        icon: "success",
        title: "Actualizado",
        text: "La categoría se actualizó correctamente.",
        timer: 1800,
        showConfirmButton: false,
        customClass: { container: "swal2-container" },
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la categoría.",
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
          <h3 className="admin-modal-title">Editar Categoría</h3>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-form-group">
            <label htmlFor="nombreCategoria" className="admin-form-label">
              Nombre de la Categoría{" "}
              <span className="admin-required-field">*</span>
            </label>
            <input
              id="nombreCategoria"
              name="nombreCategoria"
              type="text"
              value={formData.nombreCategoria}
              onChange={handleChange}
              className={`admin-form-input ${
                errors.nombreCategoria ? "admin-input-error" : ""
              }`}
              placeholder="Ej: Primaria, Secundaria, etc."
              maxLength="50"
              disabled={isSubmitting}
            />
            {errors.nombreCategoria && (
              <p className="admin-error-message">
                <FiAlertCircle /> {errors.nombreCategoria}
              </p>
            )}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              Grados Asociados <span className="admin-required-field">*</span>
            </label>
            <div
              className={`admin-dropdown-wrapper ${
                errors.grados ? "admin-input-error" : ""
              }`}
            >
              <MultiSelectDropdown
                name="grados"
                placeholder="Seleccione los grados..."
                options={gradosDisponibles.map((g) => ({
                  value: g.idGrado,
                  label: `${g.numeroGrado}° ${g.nivel}`,
                }))}
                selectedValues={formData.grados}
                onChange={handleGradosChange}
                disabled={isSubmitting}
                error={!!errors.grados}
                errorMessage={errors.grados}
              />
            </div>
            {errors.grados && (
              <p className="admin-error-message">
                <FiAlertCircle /> {errors.grados}
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

export default EditCategoriaModal;
