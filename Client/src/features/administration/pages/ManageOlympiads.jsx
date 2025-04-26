import React, { useState } from "react";
import OlympiadsTable from "../components/administrationTable/OlympiadsTable";
import RegisterOlympiadsModal from "../components/administrationModal/RegisterOlympiadsModal";
import "../Styles/General.css";

const ManageOlympiads = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div style={{ padding: "2rem", backgroundColor: "#a2bfcb" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          color: "#333",
        }}
      >
        <div>
          <h1>Olimpiadas</h1>
          <p>Gestiona las olimpiadas y sus configuraciones</p>
        </div>

        <button
          className="btn-registrar"
          onClick={() => setIsRegisterModalOpen(true)}
        >
          Registrar Olimpiada
        </button>
      </div>

      <OlympiadsTable />

      <RegisterOlympiadsModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default ManageOlympiads;
