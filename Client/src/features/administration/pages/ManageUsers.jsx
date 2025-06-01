//React
import React, { useState, useEffect } from "react";

//Api
import {
  getRoles,
  getPermisos,
  setRol,
  setUser,
} from "../../../api/Administration.api";

//Css
import "../Styles/ManageUsers.css";

const ManageUsers = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);

  const [usarRolExistente, setUsarRolExistente] = useState(true);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [nuevoRolNombre, setNuevoRolNombre] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function fetchRolesPermisos() {
      const roles = await getRoles();
      const permisos = await getPermisos();
      setRoles(roles);
      setPermisos(permisos);
    }
    fetchRolesPermisos();
  }, []);

  const togglePermiso = (id) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      let idRolFinal = rolSeleccionado;

      if (!usarRolExistente) {
        const resRol = await setRol({
          nombreRol: nuevoRolNombre,
          permisos: permisosSeleccionados,
        });
        idRolFinal = resRol.idRol;
      }

      await setUser({
        nombre,
        email,
        password,
        idRol: idRolFinal,
      });

      setMensaje("Usuario creado correctamente");
      setNombre("");
      setEmail("");
      setPassword("");
      setNuevoRolNombre("");
      setPermisosSeleccionados([]);
    } catch (error) {
      setMensaje("Error al crear usuario");
      console.log(error);
    }
  };

  return (
    <div id="crear-usuario-container">
      <h2 id="crear-usuario-titulo">Crear Usuario</h2>
      <form id="crear-usuario-form" onSubmit={crearUsuario}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="crear-usuario-nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          id="crear-usuario-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          id="crear-usuario-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="usarRol">¿Usar rol existente?</label>
        <select
          id="crear-usuario-rolselect"
          value={usarRolExistente ? "1" : "0"}
          onChange={(e) => setUsarRolExistente(e.target.value === "1")}
        >
          <option value="1">Sí</option>
          <option value="0">No, crear nuevo</option>
        </select>

        {usarRolExistente ? (
          <>
            <label htmlFor="rol">Seleccionar Rol:</label>
            <select
              id="crear-usuario-rol"
              value={rolSeleccionado}
              onChange={(e) => setRolSeleccionado(e.target.value)}
              required
            >
              <option value="">-- Selecciona un rol --</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombreRol}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <label htmlFor="nuevoRol">Nombre del nuevo rol:</label>
            <input
              id="crear-usuario-nuevorol"
              type="text"
              value={nuevoRolNombre}
              onChange={(e) => setNuevoRolNombre(e.target.value)}
              required
            />

            <label>Permisos para el nuevo rol:</label>
            <div id="crear-usuario-checkbox-group">
              {permisos.map((permiso) => (
                <label
                  key={permiso.idPermiso}
                  className="crear-usuario-checkbox"
                >
                  <input
                    type="checkbox"
                    checked={permisosSeleccionados.includes(permiso.idPermiso)}
                    onChange={() => togglePermiso(permiso.idPermiso)}
                  />
                  {permiso.nombrePermiso}
                </label>
              ))}
            </div>
          </>
        )}

        <button id="crear-usuario-boton" type="submit">
          Crear Usuario
        </button>
        {mensaje && <p id="crear-usuario-mensaje">{mensaje}</p>}
      </form>
    </div>
  );
};

export default ManageUsers;
