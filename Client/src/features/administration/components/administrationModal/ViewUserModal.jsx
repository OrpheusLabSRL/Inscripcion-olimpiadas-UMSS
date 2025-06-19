import React from "react";
import { FiX, FiKey, FiShield, FiUser, FiMail, FiAtSign } from "react-icons/fi";
import "../../Styles/ModalGeneral.css";

const PermisosModal = ({
  isOpen,
  onClose,
  permisos,
  nombreRol,
  nombreUsuario,
  nombreCompleto,
  correo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="adminModalOverlay" onClick={onClose}>
      <div
        className="adminModalContent"
        style={{ maxWidth: "800px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="adminModalCloseBtn"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <FiX />
        </button>

        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Permisos de usuario</h3>
        </div>

        <div className="adminModalBody">
          <div className="adminUserDetails">
            <p className="adminModalSubtitle">
              <FiAtSign size={16} style={{ marginRight: "6px" }} />
              Usuario: <strong>{nombreUsuario || "—"}</strong>
            </p>
            <p className="adminModalSubtitle">
              <FiUser size={16} style={{ marginRight: "6px" }} />
              Nombre completo: <strong>{nombreCompleto || "—"}</strong>
            </p>
            <p className="adminModalSubtitle">
              <FiMail size={16} style={{ marginRight: "6px" }} />
              Correo: <strong>{correo || "—"}</strong>
            </p>
            <p className="adminModalSubtitle">
              <FiShield size={16} style={{ marginRight: "6px" }} />
              Rol: <strong>{nombreRol || "Sin rol"}</strong>
            </p>
          </div>

          {permisos.length === 0 ? (
            <div className="adminEmptyState">
              <FiKey size={48} className="emptyStateIcon" />
              <h4>Sin permisos asignados</h4>
              <p>Este rol actualmente no tiene permisos definidos.</p>
            </div>
          ) : (
            <div className="permissionGrid">
              {permisos.map((permiso) => {
                const nombreFormateado = permiso.nombrePermiso
                  .split("_")
                  .map(
                    (palabra) =>
                      palabra.charAt(0).toUpperCase() + palabra.slice(1)
                  )
                  .join(" ");

                return (
                  <div key={permiso.idPermiso} className="permissionCard">
                    <div className="permissionCardHeader">
                      <h4 className="permissionName">{nombreFormateado}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermisosModal;
