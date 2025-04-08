import React, { useState } from "react";
import CategoriesTable from "../components/CategoriesTable";
import ModalAgregarCategoria from "../components/categoriaModal"; // Importa el modal
import "../styles/General.css";

const CategoryList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitCategoria = (formData) => {
    console.log("Categoría enviada:", formData);
    // Aquí puedes hacer un fetch o axios.post a tu API
    setIsModalOpen(false);
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
          <h1>Categorías</h1>
          <p>Gestiona las categorías que asociarás a las diferentes áreas</p>
        </div>
        <button className="add-button" onClick={handleOpenModal}>
          Agregar categoría
        </button>
      </div>

      <CategoriesTable />

      {/* Aquí va el modal */}
      <ModalAgregarCategoria
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCategoria}
      />
    </div>
  );
};

export default CategoryList;
