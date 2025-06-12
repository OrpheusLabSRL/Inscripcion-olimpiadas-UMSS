import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import "../../styles/ModalGeneral.css";
import {
  getRoles,
  getPermisos,
  setRol,
  setUser,
} from "../../../../api/Administration.api";

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
      // Resetear el formulario cuando se abre el modal
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

  const togglePermiso = (id) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!usarRolExistente) {
      if (!formData.nuevoRolNombre.trim()) {
        newErrors.nuevoRolNombre = "El nombre del rol es obligatorio";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let idRolFinal = rolSeleccionado;

      if (!usarRolExistente) {
        const resRol = await setRol({
          nombreRol: formData.nuevoRolNombre,
          permisos: permisosSeleccionados,
        });
        idRolFinal = resRol.idRol;
      }

      await setUser({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        idRol: idRolFinal,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setErrors({
        general: "Ocurrió un error al crear el usuario. Intente nuevamente.",
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
          <h3 className="adminModalTitle">Crear Nuevo Usuario</h3>
        </div>

        <form onSubmit={handleSubmit} className="adminModalForm">
          {errors.general && (
            <p className="adminErrorMessage" style={{ marginBottom: "1rem" }}>
              <FiAlertCircle /> {errors.general}
            </p>
          )}

          <div className="adminFormGroup">
            <label htmlFor="nombre" className="adminFormLabel">
              Nombre <span className="adminRequiredField">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.nombre ? "adminInputError" : ""
              }`}
              placeholder="Nombre completo"
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.nombre}
              </p>
            )}
          </div>

          <div className="adminFormGroup">
            <label htmlFor="email" className="adminFormLabel">
              Email <span className="adminRequiredField">*</span>
            </label>
            <input
              id="email"
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
            <label htmlFor="password" className="adminFormLabel">
              Contraseña <span className="adminRequiredField">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.password ? "adminInputError" : ""
              }`}
              placeholder="Mínimo 6 caracteres"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.password}
              </p>
            )}
          </div>

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Tipo de Rol <span className="adminRequiredField">*</span>
            </label>
            <select
              className={`adminFormSelect ${
                errors.rolSeleccionado ? "adminInputError" : ""
              }`}
              value={usarRolExistente ? "1" : "0"}
              onChange={(e) => setUsarRolExistente(e.target.value === "1")}
              disabled={isSubmitting}
            >
              <option value="1">Usar rol existente</option>
              <option value="0">Crear nuevo rol</option>
            </select>
          </div>

          {usarRolExistente ? (
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
          ) : (
            <>
              <div className="adminFormGroup">
                <label htmlFor="nuevoRolNombre" className="adminFormLabel">
                  Nombre del Nuevo Rol{" "}
                  <span className="adminRequiredField">*</span>
                </label>
                <input
                  id="nuevoRolNombre"
                  name="nuevoRolNombre"
                  type="text"
                  value={formData.nuevoRolNombre}
                  onChange={handleChange}
                  className={`adminFormInput ${
                    errors.nuevoRolNombre ? "adminInputError" : ""
                  }`}
                  placeholder="Nombre del nuevo rol"
                  disabled={isSubmitting}
                />
                {errors.nuevoRolNombre && (
                  <p className="adminErrorMessage">
                    <FiAlertCircle /> {errors.nuevoRolNombre}
                  </p>
                )}
              </div>

              <div className="adminFormGroup">
                <label className="adminFormLabel">
                  Permisos <span className="adminRequiredField">*</span>
                </label>
                <div className="adminPermissionsGrid">
                  {permisos.map((permiso) => (
                    <div
                      key={permiso.idPermiso}
                      className="adminPermissionItem"
                    >
                      <input
                        type="checkbox"
                        id={`permiso-${permiso.idPermiso}`}
                        checked={permisosSeleccionados.includes(
                          permiso.idPermiso
                        )}
                        onChange={() => togglePermiso(permiso.idPermiso)}
                        disabled={isSubmitting}
                      />
                      <label htmlFor={`permiso-${permiso.idPermiso}`}>
                        {permiso.nombrePermiso}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.permisos && (
                  <p className="adminErrorMessage">
                    <FiAlertCircle /> {errors.permisos}
                  </p>
                )}
              </div>
            </>
          )}

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
              {isSubmitting ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
