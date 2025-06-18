import React from "react";
import { FiX, FiKey, FiShield } from "react-icons/fi";
import "../../Styles/ModalGeneral.css";

const PermisosModal = ({
  isOpen,
  onClose,
  permisos,
  nombreRol,
  nombreUsuario,
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
          <h3 className="adminModalTitle">
            Permisos de{" "}
            <span className="highlight">{nombreUsuario || "usuario"}</span>
          </h3>
        </div>

        <p className="adminModalSubtitle">
          <FiShield
            size={16}
            style={{ marginRight: "6px", verticalAlign: "middle" }}
          />
          Rol: <strong>{nombreRol}</strong>
        </p>

        <div className="adminModalBody">
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
