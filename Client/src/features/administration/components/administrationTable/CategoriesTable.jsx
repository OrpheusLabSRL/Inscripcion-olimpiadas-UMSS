import React, { useEffect, useState } from "react";
import { getCategoriaGrado } from "../../../../api/Administration.api";
import "../../Styles/General.css";

const CategoriesTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getCategoriaGrado();
        const data = response || [];
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) return <p>Cargando categorías...</p>;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Grado</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(categorias) && categorias.length > 0 ? (
          categorias.map((cat, index) => (
            <tr key={index}>
              <td>{cat.categoria?.nombreCategoria || "-"}</td>
              <td>
                {cat.grado
                  ? `${cat.grado.numeroGrado}° de ${cat.grado.nivel}`
                  : "No asignado"}
              </td>
              <td>
                <span
                  className={`badge ${
                    cat.estadoCategoriaGrado ? "badge-success" : "badge-danger"
                  }`}
                >
                  {cat.estadoCategoriaGrado ? "Activo" : "Inactivo"}
                </span>
              </td>
            </tr>
          ))
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
