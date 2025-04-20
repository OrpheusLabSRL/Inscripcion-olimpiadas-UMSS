import React from "react";
import CategoriesTable from "../components/administrationTable/CategoriesTable";
import "../Styles/General.css";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/admin/base-data");
  };

  return (
    <div className="category-container" style={{ padding: "2rem" }}>
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
          <h1>Categorías</h1>
          <p>Gestiona las categorías que asociarás a las diferentes áreas</p>
        </div>
      </div>

      <CategoriesTable />
    </div>
  );
};

export default CategoryList;
