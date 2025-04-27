import React, { useState } from "react";
import OlympiadsTable from "../components/administrationTable/OlympiadsTable";
import RegisterOlympiadsModal from "../components/administrationModal/RegisterOlympiadsModal";
import "../Styles/General.css";

const ManageOlympiads = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#a2bfcb",
        minHeight: "100vh", // 🔥 Asegura cubrir toda la pantalla
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          color: "#333",
        }}
      >
        <div>
          <h1 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
            Olimpiadas
          </h1>
          <p>Gestiona las olimpiadas y sus configuraciones</p>
        </div>

        <button
          className="btn-registrar"
          onClick={() => setIsRegisterModalOpen(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Registrar Olimpiada
        </button>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflowX: "auto",
          flexGrow: 1,
          width: "90%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <OlympiadsTable />
      </div>

      {/* Modal de registro */}
      <RegisterOlympiadsModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default ManageOlympiads;
