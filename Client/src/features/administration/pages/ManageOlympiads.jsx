import React, { useState } from "react";
import OlympiadsTable from "../components/OlympiadsTable";
import OlympiadsModal from "../components/OlympiadsModal";
import "../styles/General.css";
import "../styles/ModalGeneral.css";

const ManageOlympiads = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Solo se usa para refrescar la tabla o cerrar modal después del guardado
  const handleSaveOlympiad = () => {
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "black",
        }}
      >
        <div>
          <h1>Olimpiadas</h1>
          <p>Gestiona las olimpiadas y sus configuraciones</p>
        </div>
        <button className="add-button" onClick={handleOpenModal}>
          + Nueva Olimpiada
        </button>
      </div>

      <OlympiadsTable />

      <OlympiadsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOlympiad}
      />
    </div>
  );
};

export default ManageOlympiads;
