import React, { useState } from "react";
import AreasTable from "../components/administrationTable/AreasTable.jsx";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import RegisterNewAreaModal from "../components/administrationModal/RegisterNewAreaModal.jsx";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import "../Styles/General.css";

const AreaList = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleSuccess = () => {
    setModalOpen(false);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="adminAreaContainer">
      <div className="adminContentWrapper">
        <div
          className="areaHeaderSection"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BackButton
            onClick={() => navigate("/admin/view-base")}
            className="btnBack"
          >
            <FaArrowLeft className="btnBackIcon" /> Volver a Datos Base
          </BackButton>

          <div
            className="areaTitleGroup"
            style={{ flexGrow: 1, marginLeft: "1rem" }}
          >
            <h1 className="areaTitle">Gestión de Áreas</h1>
            <p className="areaSubtitle">
              Administra las áreas principales de competencia académica
            </p>
          </div>

          {/* Botón para abrir el modal de nueva área con misma clase y estilo que categorías */}
          <button
            className="btnAddCategoryArea"
            onClick={() => setModalOpen(true)}
          >
            <FaPlus className="buttonIcon" />
            Registrar Nueva Área
          </button>
        </div>

        <div className="adminTableWrapper" style={{ marginTop: "1rem" }}>
          <AreasTable key={reloadKey} />
        </div>
      </div>

      <RegisterNewAreaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AreaList;
