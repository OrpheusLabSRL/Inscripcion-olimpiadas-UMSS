import React, { useEffect, useState } from "react";
import {
  getCategoriaGrado,
  changeEstadoCategoriaGrado,
  deleteCategoriaGrado,
  verificarUsoCategoriasMasivo,
} from "../../../../api/Administration.api";
import {
  FaSpinner,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import "../../Styles/Tables.css";
import Swal from "sweetalert2";
import EditCategoriaModal from "../administrationModal/EditCategoriaModal";

const CategoriesTable = () => {
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState({});
  const [categoriasEnUso, setCategoriasEnUso] = useState({});
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
      const agrupado = {};

      for (const cat of data) {
        const nombreCategoria =
          cat.categoria?.nombreCategoria || "Sin categoría";
        const idCategoria = cat.categoria?.idCategoria;

        if (!agrupado[nombreCategoria]) {
          agrupado[nombreCategoria] = {
            id: cat.id_CategoriaGrado,
            idCategoria,
            nombreCategoria,
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
      }

      const ids = Object.values(agrupado)
        .map((cat) => cat.idCategoria)
        .filter((id) => id);

      let uso = {};
      try {
        uso = await verificarUsoCategoriasMasivo(ids);
      } catch (e) {
        console.error("Error al verificar uso de categorías:", e);
        uso = {};
      }

      setCategoriasAgrupadas(agrupado);
      setCategoriasEnUso(uso);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setCategoriasAgrupadas({});
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (nombreCategoria) => {
    setExpandedCategory(
      expandedCategory === nombreCategoria ? null : nombreCategoria
    );
  };

  const handleChangeStatus = async (nombreCategoria) => {
    try {
      const categoria = categoriasAgrupadas[nombreCategoria];
      const nuevoEstado = !categoria.estadoCategoriaGrado;

      if (nuevoEstado === false) {
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          html: `
            <p>Al desactivar esta categoría:</p>
            <ul style="text-align: left; margin-left: 20px;">
              <li>No estará disponible para nuevas olimpiadas</li>
              <li>Las olimpiadas existentes que ya la incluyen <strong>NO</strong> se verán afectadas</li>
              <li>Los grados asociados mantendrán su estado actual</li>
            </ul>
            <p>¿Deseas continuar?</p>
          `,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, desactivar",
          cancelButtonText: "Cancelar",
          customClass: {
            container: "swal2-container",
            popup: "swal2-popup-custom",
          },
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      setUpdating(true);

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
            deleteCategoriaGrado(item.idCategoriaGrado)
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
    fetchCategorias();
    setEditModalOpen(false);
  };

  return (
    <div className="categoryTableWrapper">
      <table className="categoryTable">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Grados Incluidos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="tableUtilLoading">
                <FaSpinner className="tableUtilSpinner" />
                Cargando categorías...
              </td>
            </tr>
          ) : Object.keys(categoriasAgrupadas).length > 0 ? (
            Object.entries(categoriasAgrupadas).map(
              ([nombreCategoria, data], index) => {
                const estaEnUso = categoriasEnUso[data.idCategoria];

                return (
                  <React.Fragment key={index}>
                    <tr
                      className={`categoryTableRow ${
                        expandedCategory === nombreCategoria ? "expanded" : ""
                      }`}
                    >
                      <td
                        className="categoryTableName"
                        onClick={() => toggleExpand(nombreCategoria)}
                      >
                        {nombreCategoria} <FaInfoCircle className="infoIcon" />
                      </td>
                      <td
                        className="tableUtilTextCenter"
                        onClick={() => toggleExpand(nombreCategoria)}
                      >
                        {data.grados.slice(0, 3).join(", ")}
                        {data.grados.length > 3 && (
                          <span className="categoryTableMoreCount">
                            +{data.grados.length - 3}
                          </span>
                        )}
                      </td>
                      <td className="tableUtilTextCenter">
                        <button
                          className={`tableUtilStatusToggle ${
                            data.estadoCategoriaGrado ? "active" : "inactive"
                          } ${updating ? "disabled" : ""}`}
                          onClick={() =>
                            !updating && handleChangeStatus(nombreCategoria)
                          }
                          disabled={updating}
                          title={
                            data.estadoCategoriaGrado ? "Desactivar" : "Activar"
                          }
                        >
                          {updating ? (
                            <FaSpinner className="tableUtilSpinner" />
                          ) : data.estadoCategoriaGrado ? (
                            <FaToggleOn className="toggleIcon active" />
                          ) : (
                            <FaToggleOff className="toggleIcon inactive" />
                          )}
                          <span>
                            {data.estadoCategoriaGrado ? "Activo" : "Inactivo"}
                          </span>
                        </button>
                      </td>
                      <td className="tableActions">
                        <div className="actionButtons">
                          <button
                            className={`actionButton editButton ${
                              updating || estaEnUso ? "disabled" : ""
                            }`}
                            onClick={() =>
                              !updating && !estaEnUso && handleEdit(data)
                            }
                            disabled={updating || estaEnUso}
                            title={
                              estaEnUso
                                ? "No se puede editar (en uso)"
                                : "Editar categoría"
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`actionButton deleteButton ${
                              updating || estaEnUso ? "disabled" : ""
                            }`}
                            onClick={() =>
                              !updating &&
                              !estaEnUso &&
                              handleDelete(nombreCategoria)
                            }
                            disabled={updating || estaEnUso}
                            title={
                              estaEnUso
                                ? "No se puede eliminar (en uso)"
                                : "Eliminar categoría"
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedCategory === nombreCategoria && (
                      <tr className="categoryTableDetails">
                        <td colSpan="4">
                          <h4>Grados completos:</h4>
                          <div className="gradesList">
                            {data.grados.map((grado, i) => (
                              <span key={i} className="categoryTableTag">
                                {grado}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }
            )
          ) : (
            <tr>
              <td colSpan="4" className="tableUtilEmpty">
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
