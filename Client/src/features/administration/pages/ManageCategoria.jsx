// src/features/categories/pages/CategoryList.jsx
import React from "react";
import CategoriesTable from "../components/CategoriesTable";
import "../styles/General.css";

const CategoryList = () => {
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
          <h1>Categorías</h1>
          <p>Gestiona las categorías que asociarás a las diferentes áreas</p>
        </div>
        <button className="add-button">Agregar categoría</button>
      </div>

      <CategoriesTable />
    </div>
  );
};

export default CategoryList;
