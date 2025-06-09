import React, { useState } from "react";
import UsersTable from "../components/administrationTable/UserTable";
import BackButton from "../../../components/Buttons/BackButton";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../Styles/General.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="adminUsersContainer">
      <div className="adminContentWrapper">
        <div className="usersHeaderSection">
          <BackButton
            onClick={() => navigate("/admin/view-base")}
            className="btnBack"
          >
            <FaArrowLeft className="btnBackIcon" />
            Volver a Datos Base
          </BackButton>

          <div className="usersHeaderText">
            <h1 className="usersTitle">Gestión de Usuarios</h1>
            <p className="usersSubtitle">
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

        <div className="adminTableWrapper">
          <UsersTable />
        </div>
      </div>

      {/* Modal para registrar nuevo usuario */}
      {/* <RegisterUserModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      /> */}
    </div>
  );
};

export default UserManagement;
