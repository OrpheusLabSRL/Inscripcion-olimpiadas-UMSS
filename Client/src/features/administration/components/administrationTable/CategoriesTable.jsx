import React, { useEffect, useState } from "react";
import { getCategoriaGrado } from "../../../../api/Administration.api";
import { FaSpinner, FaInfoCircle } from "react-icons/fa";
import "../../Styles/Tables.css";

const CategoriesTable = () => {
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getCategoriaGrado();
        const data = response || [];

        const agrupado = {};
        data.forEach((cat) => {
          const nombreCategoria =
            cat.categoria?.nombreCategoria || "Sin categoría";
          if (!agrupado[nombreCategoria]) {
            agrupado[nombreCategoria] = {
              grados: [],
              estadoCategoriaGrado: cat.estadoCategoriaGrado,
            };
          }
          if (cat.grado) {
            agrupado[nombreCategoria].grados.push(
              `${cat.grado.numeroGrado}° ${cat.grado.nivel}`
            );
          }
        });

        setCategoriasAgrupadas(agrupado);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategoriasAgrupadas({});
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const toggleExpand = (nombreCategoria) => {
    setExpandedCategory(
      expandedCategory === nombreCategoria ? null : nombreCategoria
    );
  };

  return (
    <div className="category-table-wrapper">
      <table className="category-table">
        <thead>
          <tr>
            <th>Categoría</th>
            <th className="table-util-text-center">Grados Incluidos</th>
            <th className="table-util-text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="table-util-loading">
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
                    onClick={() => toggleExpand(nombreCategoria)}
                  >
                    <td className="category-table-name">
                      {nombreCategoria} <FaInfoCircle className="info-icon" />
                    </td>
                    <td className="table-util-text-center">
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
                        }`}
                      >
                        {data.estadoCategoriaGrado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                  {expandedCategory === nombreCategoria && (
                    <tr className="category-table-details">
                      <td colSpan="3">
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
              <td colSpan="3" className="table-util-empty">
                No hay categorías registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
