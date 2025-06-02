import React, { useEffect, useState } from "react";
import {
  getCategoriaGrado,
  changeEstadoCategoriaGrado,
  deleteCategoriaGrado,
} from "../../../../api/Administration.api";
import { FaSpinner, FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/Tables.css";
import Swal from "sweetalert2";
import EditCategoriaModal from "../administrationModal/EditCategoriaModal";

const CategoriesTable = () => {
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await getCategoriaGrado();
      const data = response || [];
      processCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setCategoriasAgrupadas({});
    } finally {
      setLoading(false);
    }
  };

  const processCategorias = (data) => {
    const agrupado = {};
    data.forEach((cat) => {
      const nombreCategoria = cat.categoria?.nombreCategoria || "Sin categoría";
      if (!agrupado[nombreCategoria]) {
        agrupado[nombreCategoria] = {
          id: cat.id_CategoriaGrado,
          idCategoria: cat.categoria?.idCategoria,
          nombreCategoria: nombreCategoria,
          grados: [],
          estadoCategoriaGrado: cat.estadoCategoriaGrado,
          rawData: [cat],
          gradosData: cat.grado ? [cat.grado] : [],
        };
      } else {
        agrupado[nombreCategoria].rawData.push(cat);
        if (cat.grado) {
          agrupado[nombreCategoria].gradosData.push(cat.grado);
        }
      }
      if (cat.grado) {
        agrupado[nombreCategoria].grados.push(
          `${cat.grado.numeroGrado}° ${cat.grado.nivel}`
        );
      }
    });
    setCategoriasAgrupadas(agrupado);
  };

  const toggleExpand = (nombreCategoria) => {
    setExpandedCategory(
      expandedCategory === nombreCategoria ? null : nombreCategoria
    );
  };

  const handleChangeStatus = async (nombreCategoria) => {
    try {
      setUpdating(true);
      const categoria = categoriasAgrupadas[nombreCategoria];
      const nuevoEstado = !categoria.estadoCategoriaGrado;

      await Promise.all(
        categoria.rawData.map((item) =>
          changeEstadoCategoriaGrado(item.idCategoriaGrado, nuevoEstado)
        )
      );

      setCategoriasAgrupadas((prev) => ({
        ...prev,
        [nombreCategoria]: {
          ...prev[nombreCategoria],
          estadoCategoriaGrado: nuevoEstado,
          rawData: prev[nombreCategoria].rawData.map((item) => ({
            ...item,
            estadoCategoriaGrado: nuevoEstado,
          })),
        },
      }));

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La categoría ${nombreCategoria} ha sido ${
          nuevoEstado ? "activada" : "desactivada"
        }`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado de la categoría",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (nombreCategoria) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará la categoría ${nombreCategoria} y sus relaciones con grados`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setUpdating(true);
        const categoria = categoriasAgrupadas[nombreCategoria];

        await Promise.all(
          categoria.rawData.map((item) =>
            deleteCategoriaGrado(item.id_CategoriaGrado)
          )
        );

        const nuevasCategorias = { ...categoriasAgrupadas };
        delete nuevasCategorias[nombreCategoria];
        setCategoriasAgrupadas(nuevasCategorias);

        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: `La categoría ${nombreCategoria} ha sido eliminada`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la categoría",
        });
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleEdit = (categoriaData) => {
    setSelectedCategoria({
      idCategoria: categoriaData.idCategoria,
      nombreCategoria: categoriaData.nombreCategoria,
      grados: categoriaData.gradosData.map((g) => g.idGrado),
    });
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchCategorias(); // Refrescar los datos después de editar
    setEditModalOpen(false);
  };

  return (
    <div className="category-table-wrapper">
      <table className="category-table">
        <thead>
          <tr>
            <th>Categoría</th>
            <th className="table-util-text-center">Grados Incluidos</th>
            <th className="table-util-text-center">Estado</th>
            <th className="table-util-text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="table-util-loading">
                <FaSpinner className="table-util-spinner" />
                Cargando categorías...
              </td>
            </tr>
          ) : Object.keys(categoriasAgrupadas).length > 0 ? (
            Object.entries(categoriasAgrupadas).map(
              ([nombreCategoria, data], index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`category-table-row ${
                      expandedCategory === nombreCategoria ? "expanded" : ""
                    }`}
                  >
                    <td
                      className="category-table-name"
                      onClick={() => toggleExpand(nombreCategoria)}
                    >
                      {nombreCategoria} <FaInfoCircle className="info-icon" />
                    </td>
                    <td
                      className="table-util-text-center"
                      onClick={() => toggleExpand(nombreCategoria)}
                    >
                      {data.grados.slice(0, 3).join(", ")}
                      {data.grados.length > 3 && (
                        <span className="category-table-more-count">
                          +{data.grados.length - 3}
                        </span>
                      )}
                    </td>
                    <td className="table-util-text-center">
                      <span
                        className={`table-util-status-badge ${
                          data.estadoCategoriaGrado
                            ? "table-util-badge-success"
                            : "table-util-badge-danger"
                        } ${updating ? "table-util-disabled" : ""}`}
                        onClick={() =>
                          !updating && handleChangeStatus(nombreCategoria)
                        }
                        style={{ cursor: updating ? "not-allowed" : "pointer" }}
                      >
                        {updating ? (
                          <FaSpinner className="table-util-spinner" />
                        ) : data.estadoCategoriaGrado ? (
                          "Activo"
                        ) : (
                          "Inactivo"
                        )}
                      </span>
                    </td>
                    <td className="table-actions">
                      <FaEdit
                        className="action-icon edit-icon"
                        title="Editar categoría"
                        onClick={() => handleEdit(data)}
                        style={
                          updating
                            ? { opacity: 0.5, pointerEvents: "none" }
                            : null
                        }
                      />
                      <FaTrash
                        className="action-icon delete-icon"
                        title="Eliminar categoría"
                        onClick={() =>
                          !updating && handleDelete(nombreCategoria)
                        }
                        style={
                          updating
                            ? { opacity: 0.5, pointerEvents: "none" }
                            : null
                        }
                      />
                    </td>
                  </tr>
                  {expandedCategory === nombreCategoria && (
                    <tr className="category-table-details">
                      <td colSpan="4">
                        <h4>Grados completos:</h4>
                        <div className="grades-list">
                          {data.grados.map((grado, i) => (
                            <span key={i} className="category-table-tag">
                              {grado}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            )
          ) : (
            <tr>
              <td colSpan="4" className="table-util-empty">
                No hay categorías registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <EditCategoriaModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        categoria={selectedCategoria}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default CategoriesTable;
