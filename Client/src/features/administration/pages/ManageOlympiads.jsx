import React, { useState } from "react";
import OlympiadsTable from "../components/administrationTable/OlympiadsTable";
import RegisterOlympiadsModal from "../components/administrationModal/RegisterOlympiadsModal";
import { FaPlus } from "react-icons/fa";
import "../Styles/General.css";

const ManageOlympiads = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="adminOlympiadsContainer">
      <div className="adminContentWrapper">
        <div className="olympiadsHeaderSection">
          <div className="olympiadsHeaderText">
            <h1 className="olympiadsTitle">Gestión de Olimpiadas</h1>
            <p className="olympiadsSubtitle">
              Administra y configura todas las olimpiadas académicas
            </p>
          </div>

          <button
            className="btnPrimary"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            <FaPlus className="btnIcon" />
            <span>Nueva Olimpiada</span>
          </button>
        </div>

        <div className="adminTableCard">
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
