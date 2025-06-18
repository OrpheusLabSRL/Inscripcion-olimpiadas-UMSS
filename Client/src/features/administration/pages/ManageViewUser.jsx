import React, { useState } from "react";
import UsersTable from "../components/administrationTable/UserTable";
import BackButton from "../../../components/Buttons/BackButton";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreateUserModal from "../components/administrationModal/CreateUserModal";
import "../Styles/General.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  const handleUserCreated = () => {
    setRefreshTable((prev) => !prev);
    setIsRegisterModalOpen(false);
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

          <button
            className="btnPrimary"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            <FaPlus className="btnIcon" />
            <span>Nuevo Usuario</span>
          </button>
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
    </div>
  );
};

export default UserManagement;
