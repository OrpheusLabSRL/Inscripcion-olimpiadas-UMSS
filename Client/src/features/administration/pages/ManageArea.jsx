import React from "react";
import AreasTable from "../components/AreasTable.jsx";
import "../Styles/General.css";
import { useNavigate } from "react-router-dom";

const AreaList = () => {
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
      </div>

      <AreasTable />
    </div>
  );
};

export default AreaList;
