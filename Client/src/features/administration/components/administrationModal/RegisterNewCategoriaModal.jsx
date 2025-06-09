import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import MultiSelectDropdown from "../../components/MultiSelectDropdown.jsx";
import "../../styles/Dropdown.css";
import "../../styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getGrados,
  createCategoriaWithGrados,
} from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const RegisterCategoriaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreCategoria: "",
    grados: [],
  });

  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const response = await getGrados();
        setGradosDisponibles(response || []);
      } catch (error) {
        console.error("Error al obtener grados:", error);
      }
    };

    if (isOpen) {
      fetchGrados();
      setFormData({ nombreCategoria: "", grados: [] });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleGradosChange = (selectedGrados) => {
    setFormData((prev) => ({
      ...prev,
      grados: selectedGrados.map(Number),
    }));
    setErrors((prev) => ({ ...prev, grados: null }));
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
    setFormData({ nombreCategoria: "", grados: [] });
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
        customClass: { container: "swal2Container" },
      });
      return;
    }

    const confirm = await MySwal.fire({
      title: "¿Registrar categoría?",
      text: "Se guardará la nueva categoría con los grados seleccionados.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "swal2Container" },
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);

    try {
      await createCategoriaWithGrados({
        nombreCategoria: formData.nombreCategoria,
        grados: formData.grados,
        estadoCategoriaGrado: true,
      });

      await MySwal.fire({
        icon: "success",
        title: "Registrado",
        text: "La categoría fue registrada exitosamente.",
        timer: 1800,
        showConfirmButton: false,
        customClass: { container: "swal2Container" },
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error al registrar categoría:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo registrar la categoría.",
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
          <h3 className="adminModalTitle">Registrar Categoría</h3>
        </div>

        <form onSubmit={handleSubmit} className="adminModalForm">
          <div className="adminFormGroup">
            <label htmlFor="nombreCategoria" className="adminFormLabel">
              Nombre de la Categoría{" "}
              <span className="adminRequiredField">*</span>
            </label>
            <input
              id="nombreCategoria"
              name="nombreCategoria"
              type="text"
              value={formData.nombreCategoria}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.nombreCategoria ? "adminInputError" : ""
              }`}
              placeholder="Ej: Primaria, Secundaria, etc."
              maxLength="50"
              disabled={isSubmitting}
            />
            {errors.nombreCategoria && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.nombreCategoria}
              </p>
            )}
          </div>

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Grados Asociados <span className="adminRequiredField">*</span>
            </label>
            <div
              className={`adminDropdownWrapper ${
                errors.grados ? "adminInputError" : ""
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
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.grados}
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
              {isSubmitting ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCategoriaModal;
