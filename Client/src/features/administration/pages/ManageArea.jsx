import React, { useState } from "react";
import AreasTable from "../components/AreasTable.jsx";
import AreaModal from "../components/AreaModal";
import "../styles/General.css";
import { useNavigate } from "react-router-dom";

const AreaList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/admin/base-data");
  };

  return (
    <div className="area-container" style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "black",
        }}
      >
        <div>
          <button onClick={goBack} className="back-button">
            🔙 Volver
          </button>
          <h1>Áreas</h1>
          <p>Gestiona las áreas principales de competencia</p>
        </div>
        <button className="add-button" onClick={() => setModalOpen(true)}>
          Agregar área
        </button>
      </div>

      <AreasTable />

      <AreaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => window.location.reload()}
      />
    </div>
  );
};

export default AreaList;
