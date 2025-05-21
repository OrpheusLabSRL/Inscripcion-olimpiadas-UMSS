import React from "react";
import CategoriesTable from "../components/administrationTable/CategoriesTable";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/General.css";

const CategoryList = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-category-container">
      <div className="admin-content-wrapper">
        <div className="category-header-section">
          <BackButton
            onClick={() => navigate("/admin/view-base")}
            className="btn-back"
          >
            <FaArrowLeft className="btn-back-icon" />
            Volver a Datos Base
          </BackButton>

          <div className="category-title-group">
            <h1 className="category-title">Gestión de Categorías</h1>
            <p className="category-subtitle">
              Administra las categorías asociadas a las diferentes áreas
              académicas
            </p>
          </div>
        </div>

        <div className="admin-table-card">
          <CategoriesTable />
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
