import React from "react";
import CategoriesTable from "../components/administrationTable/CategoriesTable";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/General.css";

const CategoryList = () => {
  const navigate = useNavigate();

  return (
    <div className="adminCategoryContainer">
      <div className="adminContentWrapper">
        <div className="categoryHeaderSection">
          <BackButton
            onClick={() => navigate("/admin/view-base")}
            className="btnBack"
          >
            <FaArrowLeft className="btnBackIcon" />
            Volver a Datos Base
          </BackButton>

          <div className="categoryTitleGroup">
            <h1 className="categoryTitle">Gestión de Categorías</h1>
            <p className="categorySubtitle">
              Administra las categorías asociadas a las diferentes áreas
              académicas
            </p>
          </div>
        </div>

        <div className="adminTableCard">
          <CategoriesTable />
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
