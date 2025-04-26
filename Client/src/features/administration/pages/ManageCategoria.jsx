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
          <h1>Categorías</h1>
          <p>Gestiona las categorías que asociarás a las diferentes áreas</p>
        </div>
      </div>

      <CategoriesTable />
    </div>
  );
};

export default CategoryList;
