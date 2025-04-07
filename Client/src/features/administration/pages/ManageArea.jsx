import React from "react";
import AreasTable from "../components/AreasTable.jsx";
import "../styles/General.css";

const AreaList = () => {
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
          <h1>Áreas</h1>
          <p>Gestiona las áreas principales de competencia</p>
        </div>
        <button className="add-button">Agregar área</button>
      </div>
      <AreasTable />
    </div>
  );
};

export default AreaList;
