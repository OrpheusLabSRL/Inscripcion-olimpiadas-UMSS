import React, { useEffect, useState } from "react";
import { getCategoriaGrado } from "../../../../api/Administration.api";
import "../../Styles/General.css";

const CategoriesTable = () => {
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState({});
  const [loading, setLoading] = useState(true);

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
              `${cat.grado.numeroGrado}° de ${cat.grado.nivel}`
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

  // ✅ Agrupar los grados de 3 en 3
  const agruparGradosDeTres = (grados) => {
    const grupos = [];
    for (let i = 0; i < grados.length; i += 3) {
      grupos.push(grados.slice(i, i + 3).join(", "));
    }
    return grupos;
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ textAlign: "left", paddingLeft: "1rem" }}>Categoría</th>
          <th style={{ textAlign: "center" }}>Grados</th>
          <th style={{ textAlign: "center" }}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="3">Cargando categorías...</td>
          </tr>
        ) : Object.keys(categoriasAgrupadas).length > 0 ? (
          Object.entries(categoriasAgrupadas).map(
            ([nombreCategoria, data], index) => (
              <tr key={index}>
                <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                  {nombreCategoria}
                </td>
                <td style={{ textAlign: "center", whiteSpace: "pre-line" }}>
                  {agruparGradosDeTres(data.grados).join("\n")}
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    className={`badge ${
                      data.estadoCategoriaGrado
                        ? "badge-success"
                        : "badge-danger"
                    }`}
                  >
                    {data.estadoCategoriaGrado ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            )
          )
        ) : (
          <tr>
            <td colSpan="3">No hay datos registrados.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CategoriesTable;
