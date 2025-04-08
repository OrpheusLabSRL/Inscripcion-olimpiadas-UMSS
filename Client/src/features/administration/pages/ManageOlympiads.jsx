// src/features/administration/pages/ManageOlympiads.jsx

import React, { useState } from "react";
import OlympiadsTable from "../components/OlympiadsTable";
import OlympiadsModal from "../components/OlympiadsModal"; // Importa el modal
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

  const handleSaveOlympiad = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const nuevaOlimpiada = {
      nombreOlimpiada: formData.get("nombreOlimpiada"),
      fechaInicioOlimp: formData.get("fechaInicioOlimp"),
      fechaFinOlimp: formData.get("fechaFinOlimp"),
      estadoOlimpiada: formData.get("estadoOlimpiada"),
    };

    console.log("➡️ Datos de la nueva olimpiada:", nuevaOlimpiada);
    // Aquí puedes enviar los datos a la API

    setModalOpen(false); // Cierra el modal
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

      {/* Modal */}
      <OlympiadsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOlympiad}
      />
    </div>
  );
};

export default ManageOlympiads;
