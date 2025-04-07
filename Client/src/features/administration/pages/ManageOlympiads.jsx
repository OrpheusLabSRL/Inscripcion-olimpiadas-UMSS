import React from "react";
import OlympiadsTable from "../components/OlympiadsTable";
import "../styles/General.css";

const ManageOlympiads = () => {
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
        <button className="add-button">+ Nueva Olimpiada</button>
      </div>

      <OlympiadsTable />
    </div>
  );
};

export default ManageOlympiads;
