import React from "react";
import AreasTable from "../components/administrationTable/AreasTable.jsx";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import "../Styles/General.css";

const AreaList = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/admin/base-data");
  };

  return (
    <div
      className="area-container"
      style={{ padding: "2rem", backgroundColor: "#a2bfcb" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "black",
        }}
      >
        <div>
          <BackButton onClick={goBack} className="back-button">
            Volver
          </BackButton>
          <h1>Áreas</h1>
          <p>Gestiona las áreas principales de competencia</p>
        </div>
      </div>

      <AreasTable />
    </div>
  );
};

export default AreaList;
