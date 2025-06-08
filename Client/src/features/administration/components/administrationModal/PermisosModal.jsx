import React from "react";
import { FiX } from "react-icons/fi";
import "../../styles/ModalGeneral.css";

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
        style={{ maxWidth: "700px" }}
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
            Permisos de {nombreUsuario || "usuario"}
          </h3>
          <p className="adminModalSubtitle">
            Rol: <strong>{nombreRol}</strong>
          </p>
        </div>

        <div className="adminModalBody">
          {permisos.length === 0 ? (
            <div className="adminEmptyState">
              Este rol no tiene permisos asignados.
            </div>
          ) : (
            <div className="permissionGrid">
              {permisos.map((permiso) => (
                <div key={permiso.idPermiso} className="permissionCard">
                  <div className="permissionCardHeader">
                    <h4 className="permissionName">{permiso.nombrePermiso}</h4>
                    {permiso.estado && (
                      <span className="tableUtilStatusBadge tableUtilBadgeSuccess">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="permissionDescription">
                    {permiso.descripcion || "Sin descripción disponible"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermisosModal;
