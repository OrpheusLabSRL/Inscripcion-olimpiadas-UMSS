import React, { useState } from "react";
import UsersTable from "../components/administrationTable/UserTable";
import BackButton from "../../../components/Buttons/BackButton";
import { FaArrowLeft, FaPlus, FaUserShield, FaListUl } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreateUserModal from "../components/administrationModal/CreateUserModal";
import CreateRoleModal from "../components/administrationModal/CreateRoleModal";
import ViewRolesPermissionsModal from "../components/administrationModal/ViewRolesModal";
import "../Styles/General.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [isViewRolesModalOpen, setIsViewRolesModalOpen] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  const handleUserCreated = () => {
    setRefreshTable((prev) => !prev);
    setIsRegisterModalOpen(false);
  };

  const handleRoleCreated = () => {
    setRefreshTable((prev) => !prev);
    setIsCreateRoleModalOpen(false);
  };

  return (
    <div className="adminUsersContainer">
      <div className="adminContentWrapper">
        <div className="olympiadsHeaderSection">
          <BackButton
            onClick={() => navigate("/admin/home")}
            className="btnBack"
          >
            <FaArrowLeft className="btnBackIcon" />
            Volver a Datos Base
          </BackButton>
          <div className="olympiadsHeaderText">
            <h1 className="olympiadsTitle">Gestión de Usuarios</h1>
            <p className="olympiadsSubtitle">
              Administra las cuentas de los usuarios del sistema
            </p>
          </div>

          <div className="adminButtonGroup">
            <button
              className="btnSecondary"
              onClick={() => setIsViewRolesModalOpen(true)}
            >
              <FaListUl className="btnIcon" />
              <span>Ver Roles</span>
            </button>
            <button
              className="btnSecondary"
              onClick={() => setIsCreateRoleModalOpen(true)}
            >
              <FaUserShield className="btnIcon" />
              <span>Nuevo Rol</span>
            </button>
            <button
              className="btnPrimary"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              <FaPlus className="btnIcon" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        <div className="adminTableCard">
          <UsersTable refresh={refreshTable} />
        </div>
      </div>

      <CreateUserModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleUserCreated}
      />

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onSuccess={handleRoleCreated}
      />

      <ViewRolesPermissionsModal
        isOpen={isViewRolesModalOpen}
        onClose={() => setIsViewRolesModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;
