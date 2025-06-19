import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getRoles,
  getPermisos,
  updateUsuario,
} from "../../../../api/Administration.api";
import "../../Styles/Dropdown.css";
import "../../Styles/ModalGeneral.css";

const MySwal = withReactContent(Swal);

const EditUserModal = ({ isOpen, onClose, onUsuarioActualizado, usuario }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    nuevoRolNombre: "",
  });
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesData, permisosData] = await Promise.all([
          getRoles(),
          getPermisos(),
        ]);
        setRoles(rolesData || []);
        setPermisos(permisosData || []);
      } catch (error) {
        console.error("Error al obtener roles o permisos:", error);
      }
    };

    if (isOpen && usuario) {
      fetchInitialData();
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        nuevoRolNombre: "",
      });
      setRolSeleccionado(usuario.rol?.idRol || "");
      setErrors({});
    }
  }, [isOpen, usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().split(/\s+/).length < 2) {
      newErrors.nombre = "Debe ingresar nombre y apellido";
    } else if (formData.nombre.length > 50) {
      newErrors.nombre = "No debe exceder los 50 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!rolSeleccionado) {
      newErrors.rolSeleccionado = "Debe seleccionar un rol";
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
        text: "Completa todos los campos correctamente.",
        customClass: { container: "swal2Container" },
      });
      return;
    }

    const confirm = await MySwal.fire({
      title: "¿Actualizar usuario?",
      text: "Se actualizarán los datos del usuario.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "swal2Container" },
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);

    try {
      const response = await updateUsuario(usuario.idUsuario, {
        nombre: formData.nombre,
        email: formData.email,
        idRol: rolSeleccionado,
      });

      await MySwal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "Los datos fueron guardados correctamente.",
        timer: 1800,
        showConfirmButton: false,
        customClass: { container: "swal2Container" },
      });

      onUsuarioActualizado?.(response.data.data);
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo actualizar el usuario.",
        customClass: { container: "swal2Container" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="adminModalOverlay" onClick={onClose}>
      <div
        className="adminModalContent"
        style={{ maxWidth: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="adminModalCloseBtn"
          onClick={onClose}
          aria-label="Cerrar modal"
          disabled={isSubmitting}
        >
          ✖
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Editar Usuario</h3>
        </div>

        <form onSubmit={handleSubmit} className="adminModalForm">
          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Nombre <span className="adminRequiredField">*</span>
            </label>
            <input
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.nombre ? "adminInputError" : ""
              }`}
              placeholder="Nombre completo (nombre y apellido)"
              maxLength="50"
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.nombre}
              </p>
            )}
          </div>

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Email <span className="adminRequiredField">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.email ? "adminInputError" : ""
              }`}
              placeholder="correo@ejemplo.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.email}
              </p>
            )}
          </div>

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Rol <span className="adminRequiredField">*</span>
            </label>
            <select
              className={`adminFormSelect ${
                errors.rolSeleccionado ? "adminInputError" : ""
              }`}
              value={rolSeleccionado}
              onChange={(e) => setRolSeleccionado(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">-- Selecciona un rol --</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombreRol}
                </option>
              ))}
            </select>
            {errors.rolSeleccionado && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.rolSeleccionado}
              </p>
            )}
          </div>

          <div className="adminModalActions">
            <button
              type="button"
              className="adminModalBtnCancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="adminModalBtnSave"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
