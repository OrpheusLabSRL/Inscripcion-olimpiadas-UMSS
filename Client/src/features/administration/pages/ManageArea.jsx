import React from "react";
import AreasTable from "../components/administrationTable/AreasTable.jsx";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/General.css";

const AreaList = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-area-container">
      <div className="area-header-section">
        <BackButton
          onClick={() => navigate("/admin/view-base")}
          className="btn-back"
        >
          <FaArrowLeft className="btn-back-icon" /> Volver a Datos Base
        </BackButton>

        <h1 className="area-title">Gestión de Áreas</h1>
        <p className="area-subtitle">
          Administra las áreas principales de competencia académica
        </p>
      </div>

      <div className="admin-table-wrapper">
        <AreasTable />
      </div>
    </div>
  );
};

export default AreaList;
