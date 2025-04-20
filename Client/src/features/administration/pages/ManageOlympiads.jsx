import React from "react";
import OlympiadsTable from "../components/administrationTable/OlympiadsTable";
import "../Styles/General.css";

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
      </div>

      <OlympiadsTable />
    </div>
  );
};

export default ManageOlympiads;
