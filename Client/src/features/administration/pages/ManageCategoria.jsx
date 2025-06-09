import React, { useState } from "react";
import CategoriesTable from "../components/administrationTable/CategoriesTable";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import "../Styles/General.css";
import RegisterCategoriaModal from "../components/administrationModal/RegisterNewCategoriaModal.jsx";
const CategoryList = () => {
  const navigate = useNavigate();

  // Estado para controlar la apertura del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para forzar actualización de la tabla (puede ser un contador simple)
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para abrir el modal
  const openModal = () => setIsModalOpen(true);

  // Función para cerrar el modal
  const closeModal = () => setIsModalOpen(false);

  // Cuando el modal registre exitosamente una categoría, incrementamos refreshKey para recargar tabla
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
          <button
            className="btnAddCategory"
            onClick={openModal}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: "bold",
            }}
          >
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
