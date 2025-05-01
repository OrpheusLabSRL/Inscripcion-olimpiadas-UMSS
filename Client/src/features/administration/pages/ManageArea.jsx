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
      style={{
        padding: "2rem",
        backgroundColor: "#a2bfcb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          marginBottom: "1.5rem",
          color: "black",
        }}
      >
        <BackButton onClick={goBack} className="back-button">
          Volver
        </BackButton>
        <h1
          style={{
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#213448",
          }}
        >
          Áreas
        </h1>
        <p>Gestiona las áreas principales de competencia</p>
      </div>

      <div
        style={{
          backgroundColor: "#ecefca",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflowX: "auto",
          flexGrow: 1,
          width: "90%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <AreasTable />
      </div>
    </div>
  );
};

export default AreaList;
