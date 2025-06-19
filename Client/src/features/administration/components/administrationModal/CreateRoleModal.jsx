import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import MultiSelectDropdown from "../dropdown/MultiSelectDropdown";
import "../../Styles/Dropdown.css";
import "../../Styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getPermisos, setRol } from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const CreateRoleModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ nombreRol: "" });
  const [permisos, setPermisos] = useState([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const permisosData = await getPermisos();
        setPermisos(permisosData || []);
      } catch (error) {
        console.error("Error al obtener permisos:", error);
      }
    };

    if (isOpen) {
      fetchPermisos();
      setFormData({ nombreRol: "" });
      setPermisosSeleccionados([]);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePermisosChange = (selectedPermisos) => {
    setPermisosSeleccionados(selectedPermisos.map(Number));
    setErrors((prev) => ({ ...prev, permisos: null }));
  };

  const formatPermissionName = (permiso) => {
    return permiso.nombrePermiso
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreRol.trim()) {
      newErrors.nombreRol = "El nombre del rol es obligatorio";
    } else if (formData.nombreRol.length > 50) {
      newErrors.nombreRol = "No debe exceder los 50 caracteres";
    }
    if (permisosSeleccionados.length === 0) {
      newErrors.permisos = "Debe seleccionar al menos un permiso";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setFormData({ nombreRol: "" });
    setPermisosSeleccionados([]);
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
      });
      return;
    }

    const confirm = await MySwal.fire({
      title: "¿Crear nuevo rol?",
      text: "Se registrará el nuevo rol con los permisos seleccionados.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);

    try {
      await setRol({
        nombreRol: formData.nombreRol,
        permisos: permisosSeleccionados,
      });
      await MySwal.fire({
        icon: "success",
        title: "Rol creado",
        text: "El rol fue registrado exitosamente.",
        timer: 1800,
        showConfirmButton: false,
      });
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error al crear rol:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo crear el rol.",
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
          disabled={isSubmitting}
        >
          ✖
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Crear Nuevo Rol</h3>
        </div>
        <form onSubmit={handleSubmit} className="adminModalForm">
          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Nombre del Rol <span className="adminRequiredField">*</span>
            </label>
            <input
              name="nombreRol"
              type="text"
              value={formData.nombreRol}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.nombreRol ? "adminInputError" : ""
              }`}
              placeholder="Nombre del nuevo rol"
              maxLength="50"
              disabled={isSubmitting}
            />
            {errors.nombreRol && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.nombreRol}
              </p>
            )}
          </div>
          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Permisos <span className="adminRequiredField">*</span>
            </label>
            <div
              className={`adminDropdownWrapper ${
                errors.permisos ? "adminInputError" : ""
              }`}
            >
              <MultiSelectDropdown
                name="permisos"
                placeholder="Seleccione los permisos..."
                options={permisos.map((p) => ({
                  value: p.idPermiso,
                  label: formatPermissionName(p),
                }))}
                selectedValues={permisosSeleccionados}
                onChange={handlePermisosChange}
                disabled={isSubmitting}
                error={!!errors.permisos}
                errorMessage={errors.permisos}
              />
            </div>
            {errors.permisos && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.permisos}
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
              {isSubmitting ? "Creando..." : "Crear Rol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoleModal;
