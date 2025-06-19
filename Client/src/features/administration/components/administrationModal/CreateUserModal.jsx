import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import MultiSelectDropdown from "../dropdown/MultiSelectDropdown";
import "../../Styles/Dropdown.css";
import "../../Styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getRoles,
  getPermisos,
  setRol,
  setUser,
} from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    nuevoRolNombre: "",
  });
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [usarRolExistente, setUsarRolExistente] = useState(true);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRolesPermisos = async () => {
      try {
        const [rolesData, permisosData] = await Promise.all([
          getRoles(),
          getPermisos(),
        ]);
        setRoles(rolesData || []);
        setPermisos(permisosData || []);
      } catch (error) {
        console.error("Error al obtener roles y permisos:", error);
      }
    };

    if (isOpen) {
      fetchRolesPermisos();
      setFormData({
        nombre: "",
        email: "",
        password: "",
        nuevoRolNombre: "",
      });
      setUsarRolExistente(true);
      setRolSeleccionado("");
      setPermisosSeleccionados([]);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleGradosChange = (selectedPermisos) => {
    setPermisosSeleccionados(selectedPermisos.map(Number));
    setErrors((prev) => ({ ...prev, permisos: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validación de nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length > 50) {
      newErrors.nombre = "No debe exceder los 50 caracteres";
    }

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Debe contener al menos una mayúscula";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Debe contener al menos un número";
    }

    // Validación de roles/permisos
    if (!usarRolExistente) {
      if (!formData.nuevoRolNombre.trim()) {
        newErrors.nuevoRolNombre = "El nombre del rol es obligatorio";
      } else if (formData.nuevoRolNombre.length > 50) {
        newErrors.nuevoRolNombre = "No debe exceder los 50 caracteres";
      }
      if (permisosSeleccionados.length === 0) {
        newErrors.permisos = "Debe seleccionar al menos un permiso";
      }
    } else if (!rolSeleccionado) {
      newErrors.rolSeleccionado = "Debe seleccionar un rol";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generarNombreUsuario = (nombreCompleto) => {
    const partes = nombreCompleto.trim().split(/\s+/);
    if (partes.length < 2) return null;

    const nombre = partes[0];
    const apellido = partes[partes.length - 1];
    const base = (nombre.slice(0, 3) + apellido).toLowerCase();

    const numerosAleatorios = Math.floor(1000 + Math.random() * 9000);
    return `${base}${numerosAleatorios}`;
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      nuevoRolNombre: "",
    });
    setUsarRolExistente(true);
    setRolSeleccionado("");
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
        customClass: { container: "swal2Container" },
      });
      return;
    }

    const confirm = await MySwal.fire({
      title: "¿Crear nuevo usuario?",
      text: "Se registrará el nuevo usuario con los datos proporcionados.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "swal2Container" },
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);

    try {
      let idRolFinal = rolSeleccionado;

      const usuario = generarNombreUsuario(formData.nombre);

      await setUser({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        idRol: idRolFinal,
        usuario,
      });

      await MySwal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "El usuario fue registrado exitosamente.",
        timer: 1800,
        showConfirmButton: false,
        customClass: { container: "swal2Container" },
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo crear el usuario.",
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
          disabled={isSubmitting}
        >
          ✖
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Crear Nuevo Usuario</h3>
        </div>

        <form onSubmit={handleSubmit} className="adminModalForm">
          {errors.general && (
            <p className="adminErrorMessage" style={{ marginBottom: "1rem" }}>
              <FiAlertCircle /> {errors.general}
            </p>
          )}

          {/* Nombre */}
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
              placeholder="Nombre completo"
              maxLength="50"
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.nombre}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Contraseña */}
          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Contraseña <span className="adminRequiredField">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.password ? "adminInputError" : ""
              }`}
              placeholder="Mínimo 6 caracteres, 1 mayúscula y 1 número"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.password}
              </p>
            )}
          </div>

          {/* Rol existente */}

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Seleccionar Rol <span className="adminRequiredField">*</span>
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

          {/* Botones */}
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
              {isSubmitting ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
