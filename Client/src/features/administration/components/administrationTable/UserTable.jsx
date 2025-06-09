import React, { useEffect, useState } from "react";
import {
  getUsuarios,
  updateUserStatus,
} from "../../../../api/Administration.api";
import { FaEye, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import PermisosModal from "../administrationModal/PermisosModal";
import Swal from "sweetalert2";
import "../../Styles/Tables.css";

const UsersTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los usuarios",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const verPermisos = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(true);
  };

  const toggleEstado = async (usuario) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        html: `Vas a ${
          usuario.estado ? "desactivar" : "activar"
        } al usuario <strong>${usuario.nombreUsuario}</strong>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        customClass: {
          container: "swal2-container",
          popup: "swal2-popup-custom",
        },
      });

      if (result.isConfirmed) {
        await updateUserStatus(usuario.idUsuario, !usuario.estado);
        setUsuarios((prev) =>
          prev.map((u) =>
            u.idUsuario === usuario.idUsuario ? { ...u, estado: !u.estado } : u
          )
        );
        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: `El usuario ha sido ${
            !usuario.estado ? "activado" : "desactivado"
          }`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del usuario",
      });
    }
  };

  const handleDelete = async (usuario) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Esta acción eliminará permanentemente a ${usuario.nombreUsuario}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        // Aquí iría la llamada a la API para eliminar
        // await deleteUser(usuario.idUsuario);
        setUsuarios((prev) =>
          prev.filter((u) => u.idUsuario !== usuario.idUsuario)
        );
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el usuario",
        });
      }
    }
  };

  return (
    <div className="adminTableCard">
      <table className="adminTable">
        <thead>
          <tr className="tableUtilHeader">
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th className="tableUtilTextCenter">Estado</th>
            <th className="tableUtilTextCenter">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="tableUtilLoading">
                <FaSpinner className="tableUtilSpinner" />
                Cargando usuarios...
              </td>
            </tr>
          ) : usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.idUsuario} className="adminTableRow">
                <td className="tableUtilTextLeft">{usuario.nombreUsuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol?.nombreRol || "Sin rol"}</td>
                <td className="tableUtilTextCenter">
                  <span
                    className={`tableUtilStatusBadge ${
                      usuario.estado
                        ? "tableUtilBadgeSuccess"
                        : "tableUtilBadgeDanger"
                    }`}
                    onClick={() => toggleEstado(usuario)}
                    style={{ cursor: "pointer" }}
                  >
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="tableActions">
                  <button
                    className="actionIcon viewIcon"
                    onClick={() => verPermisos(usuario)}
                    title="Ver permisos"
                  >
                    <FaEye />
                  </button>
                  <FaEdit
                    className="actionIcon editIcon"
                    title="Editar usuario"
                  />
                  <FaTrash
                    className="actionIcon deleteIcon"
                    onClick={() => handleDelete(usuario)}
                    title="Eliminar usuario"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="tableUtilEmpty">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PermisosModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        permisos={usuarioSeleccionado?.rol?.permisos || []}
        nombreRol={usuarioSeleccionado?.rol?.nombreRol || "Sin rol"}
        nombreUsuario={usuarioSeleccionado?.nombreUsuario || ""}
      />
    </div>
  );
};

export default UsersTable;
