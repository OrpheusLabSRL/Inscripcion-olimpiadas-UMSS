import React, { useState } from "react";
import CategoriesTable from "../components/administrationTable/CategoriesTable";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import "../Styles/General.css";
import RegisterCategoriaModal from "../components/administrationModal/RegisterNewCategoriaModal.jsx";
const CategoryList = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="adminCategoryContainer">
      <div className="adminContentWrapper">
        <div
          className="categoryHeaderSection"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BackButton
            onClick={() => navigate("/admin/view-base")}
            className="btnBack"
          >
            <FaArrowLeft className="btnBackIcon" />
            Volver a Datos Base
          </BackButton>

          <div
            className="categoryTitleGroup"
            style={{ flexGrow: 1, marginLeft: "1rem" }}
          >
            <h1 className="categoryTitle">Gestión de Categorías</h1>
            <p className="categorySubtitle">
              Administra las categorías asociadas a las diferentes áreas
              académicas
            </p>
          </div>

          {/* Botón para abrir el modal de nueva categoría */}
          <button className="btnAddCategoryArea" onClick={openModal}>
            <FaPlus /> Nueva Categoría
          </button>
        </div>

        <div className="adminTableCard" style={{ marginTop: "1rem" }}>
          {/* Le pasamos la refreshKey para que CategoriesTable pueda usarlo para actualizarse */}
          <CategoriesTable key={refreshKey} />
        </div>
      </div>

      {/* Modal para registrar categoría */}
      <RegisterCategoriaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CategoryList;
