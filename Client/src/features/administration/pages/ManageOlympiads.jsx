import React, { useState } from "react";
import OlympiadsTable from "../components/administrationTable/OlympiadsTable";
import RegisterOlympiadsModal from "../components/administrationModal/RegisterOlympiadsModal";
import { FaPlus } from "react-icons/fa";
import "../Styles/General.css";

const ManageOlympiads = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="admin-olympiads-container">
      <div className="admin-content-wrapper">
        <div className="olympiads-header-section">
          <div className="olympiads-header-text">
            <h1 className="olympiads-title">Gestión de Olimpiadas</h1>
            <p className="olympiads-subtitle">
              Administra y configura todas las olimpiadas académicas
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            <FaPlus className="btn-icon" />
            <span>Nueva Olimpiada</span>
          </button>
        </div>

        <div className="admin-table-card">
          <OlympiadsTable />
        </div>
      </div>

      <RegisterOlympiadsModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default ManageOlympiads;
