import React, { useEffect, useState } from "react";
import {
  getUsuarios,
  updateUsuarioEstado,
  deleteUsuario,
} from "../../../../api/Administration.api";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaToggleOn,
  FaToggleOff,
  FaKey,
} from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import PermisosModal from "../administrationModal/ViewUserModal";
import EditUserModal from "../administrationModal/EditUserModal";
import ChangePasswordModal from "../administrationModal/ChangePasswordModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../Styles/Tables.css";

const MySwal = withReactContent(Swal);

const UsersTable = ({ refresh }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);
  const [modalPasswordAbierto, setModalPasswordAbierto] = useState(false);
  const [usuarioParaCambiarPassword, setUsuarioParaCambiarPassword] =
    useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const { data } = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los usuarios",
          customClass: { container: "swal2Container" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [refresh]);

  const actualizarUsuarioEnLista = (usuarioActualizado) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.idUsuario === usuarioActualizado.idUsuario ? usuarioActualizado : u
      )
    );
  };

  const verPermisos = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(true);
  };

  const editarUsuario = (usuario) => {
    setUsuarioParaEditar(usuario);
    setModalEditarAbierto(true);
  };

  const cambiarPassword = (usuario) => {
    setUsuarioParaCambiarPassword(usuario);
    setModalPasswordAbierto(true);
  };

  const toggleEstado = async (usuario) => {
    try {
      const result = await MySwal.fire({
        title: "¿Estás seguro?",
        html: `Vas a ${
          usuario.estadoUsuario === 1 ? "desactivar" : "activar"
        } al usuario <strong>${usuario.nombreUsuario}</strong>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        customClass: { container: "swal2Container" },
      });

      if (result.isConfirmed) {
        const nuevoEstado = usuario.estadoUsuario === 1 ? 0 : 1;
        await updateUsuarioEstado(usuario.idUsuario, nuevoEstado);

        setUsuarios((prev) =>
          prev.map((u) =>
            u.idUsuario === usuario.idUsuario
              ? { ...u, estadoUsuario: nuevoEstado }
              : u
          )
        );

        MySwal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: `El usuario ha sido ${
            nuevoEstado === 1 ? "activado" : "desactivado"
          }`,
          timer: 2000,
          showConfirmButton: false,
          customClass: { container: "swal2Container" },
        });
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo cambiar el estado del usuario",
        customClass: { container: "swal2Container" },
      });
    }
  };

  const handleDelete = async (usuario) => {
    const result = await MySwal.fire({
      title: "¿Eliminar usuario?",
      text: `Esta acción eliminará permanentemente a ${usuario.nombreUsuario}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "swal2Container" },
    });

    if (result.isConfirmed) {
      try {
        await deleteUsuario(usuario.idUsuario);
        setUsuarios((prev) =>
          prev.filter((u) => u.idUsuario !== usuario.idUsuario)
        );
        MySwal.fire({
          icon: "success",
          title: "Usuario eliminado",
          timer: 2000,
          showConfirmButton: false,
          customClass: { container: "swal2Container" },
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message || "No se pudo eliminar el usuario",
          customClass: { container: "swal2Container" },
        });
      }
    }
  };

  return (
    <div className="UserTableCard">
      <div className="table-responsive">
        <table className="adminTable">
          <thead>
            <tr className="tableUtilHeader">
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              {/*<th className="tableUtilTextCenter">Estado</th>*/}
              <th className="tableUtilTextCenter">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="tableUtilLoading">
                  <FaSpinner className="tableUtilSpinner" spin />
                  Cargando usuarios...
                </td>
              </tr>
            ) : usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.idUsuario} className="adminTableRow">
                  <td className="tableUtilTextLeft">{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol?.nombreRol || "Sin rol"}</td>
                  {/*<td className="tableUtilTextCenter">
                    <button
                      className={`tableUtilStatusToggle ${
                        usuario.estadoUsuario === 1 ? "active" : "inactive"
                      }`}
                      onClick={() => toggleEstado(usuario)}
                      title={
                        usuario.estadoUsuario === 1 ? "Desactivar" : "Activar"
                      }
                    >
                      {usuario.estadoUsuario === 1 ? (
                        <FaToggleOn className="toggleIcon active" />
                      ) : (
                        <FaToggleOff className="toggleIcon inactive" />
                      )}
                      <span>
                        {usuario.estadoUsuario === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </button>
                  </td>*/}
                  <td className="tableActions">
                    <div className="actionButtons">
                      <button
                        className="actionButton viewButton"
                        onClick={() => verPermisos(usuario)}
                        title="Ver permisos"
                      >
                        <CiCircleInfo />
                      </button>
                      <button
                        className="actionButton editButton"
                        title="Editar usuario"
                        onClick={() => editarUsuario(usuario)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="actionButton passwordButton"
                        onClick={() => cambiarPassword(usuario)}
                        title="Cambiar contraseña"
                      >
                        <FaKey />
                      </button>
                      <button
                        className="actionButton deleteButton"
                        onClick={() => handleDelete(usuario)}
                        title="Eliminar usuario"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="tableUtilEmpty">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PermisosModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        permisos={usuarioSeleccionado?.rol?.permisos || []}
        nombreRol={usuarioSeleccionado?.rol?.nombreRol || "Sin rol"}
        nombreUsuario={usuarioSeleccionado?.nombreUsuario || ""}
        nombreCompleto={usuarioSeleccionado?.nombre || ""}
        correo={usuarioSeleccionado?.email || ""}
      />

      <EditUserModal
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onUsuarioActualizado={actualizarUsuarioEnLista}
        usuario={usuarioParaEditar}
      />

      <ChangePasswordModal
        isOpen={modalPasswordAbierto}
        onClose={() => setModalPasswordAbierto(false)}
        usuario={usuarioParaCambiarPassword}
      />
    </div>
  );
};

export default UsersTable;
