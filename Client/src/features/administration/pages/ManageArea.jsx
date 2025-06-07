import React from "react";
import AreasTable from "../components/administrationTable/AreasTable.jsx";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/General.css";

const AreaList = () => {
  const navigate = useNavigate();

  return (
    <div className="adminAreaContainer">
      <div className="adminContentWrapper">
        <div className="areaHeaderSection">
          <BackButton
            onClick={() => navigate("/admin/view-base")}
            className="btnBack"
          >
            <FaArrowLeft className="btnBackIcon" /> Volver a Datos Base
          </BackButton>
          <h1 className="areaTitle">Gestión de Áreas</h1>
          <p className="areaSubtitle">
            Administra las áreas principales de competencia académica
          </p>
        </div>

        <div className="adminTableWrapper">
          <AreasTable />
        </div>
      </div>
    </div>
  );
};

export default AreaList;
