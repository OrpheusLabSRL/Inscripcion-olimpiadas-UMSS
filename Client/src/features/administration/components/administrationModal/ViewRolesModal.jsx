import React, { useState, useEffect } from "react";
import { FiAlertCircle, FiUsers } from "react-icons/fi";
import "../../Styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getRolesPermisos } from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const ViewRolesModal = ({ isOpen, onClose }) => {
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRolesPermissions = async () => {
      try {
        setLoading(true);
        const data = await getRolesPermisos();

        const groupedData = data.reduce((acc, item) => {
          const existingRole = acc.find((role) => role.idRol === item.idRol);
          if (existingRole) {
            existingRole.permisos.push(item.permiso);
          } else {
            acc.push({
              idRol: item.idRol,
              nombreRol: item.rol.nombreRol,
              descripcionRol: item.rol.descripcionRol,
              estadoRol: item.rol.estadoRol,
              permisos: [item.permiso],
            });
          }
          return acc;
        }, []);

        setRolesData(groupedData);
        setError(null);
      } catch (err) {
        console.error("Error al obtener roles y permisos:", err);
        setError("Error al cargar los roles y permisos");
        setRolesData([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchRolesPermissions();
    }
  }, [isOpen]);

  const formatPermissionName = (permiso) => {
    return permiso.nombrePermiso
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!isOpen) return null;

  return (
    <div className="adminModalOverlay" onClick={onClose}>
      <div
        className="adminModalContent"
        style={{ maxWidth: "800px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="adminModalCloseBtn" onClick={onClose}>
          ✖
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">
            <FiUsers className="modalTitleIcon" /> Roles y Permisos del Sistema
          </h3>
        </div>

        <div className="adminModalBody" style={{ overflowY: "auto" }}>
          {loading ? (
            <div className="adminLoadingMessage">
              Cargando roles y permisos...
            </div>
          ) : error ? (
            <div className="adminErrorMessage">
              <FiAlertCircle /> {error}
            </div>
          ) : rolesData.length === 0 ? (
            <div className="adminEmptyMessage">No hay roles registrados</div>
          ) : (
            <div className="rolesPermissionsContainer">
              {rolesData.map((rol) => (
                <div key={rol.idRol} className="roleCard">
                  <div className="roleHeader">
                    <h4 className="roleTitle">{rol.nombreRol}</h4>
                    <span
                      className={`roleStatus ${
                        rol.estadoRol ? "active" : "inactive"
                      }`}
                    >
                      {rol.estadoRol ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  {rol.descripcionRol && (
                    <p className="roleDescription">{rol.descripcionRol}</p>
                  )}

                  <div className="permissionsSection">
                    <h5 className="permissionsTitle">Permisos asignados:</h5>
                    <div className="permissionsGrid">
                      {rol.permisos && rol.permisos.length > 0 ? (
                        rol.permisos.map((permiso) => (
                          <div
                            key={permiso.idPermiso}
                            className="permissionItem"
                          >
                            <span className="permissionName">
                              {formatPermissionName(permiso)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="noPermissions">
                          Este rol no tiene permisos asignados
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRolesModal;
