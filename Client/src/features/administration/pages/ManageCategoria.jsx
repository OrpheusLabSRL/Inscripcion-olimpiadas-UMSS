import React from "react";
import CategoriesTable from "../components/administrationTable/CategoriesTable";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import "../Styles/General.css";

const CategoryList = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/admin/base-data");
  };

  return (
    <div
      className="category-container"
      style={{
        minHeight: "100vh",
        backgroundColor: "#a2bfcb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "2rem",
          flex: "1 0 auto",
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
            Categorías
          </h1>
          <p>Gestiona las categorías que asociarás a las diferentes áreas</p>
        </div>

        <div
          style={{
            backgroundColor: "#ecefca",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            flexGrow: 1,
            overflowX: "auto",
          }}
        >
          <CategoriesTable />
        </div>
      </div>

      <div style={{ flexShrink: 0 }}></div>
    </div>
  );
};

export default CategoryList;
