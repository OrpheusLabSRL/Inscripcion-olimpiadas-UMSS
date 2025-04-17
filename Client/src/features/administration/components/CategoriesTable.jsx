import React, { useEffect, useState } from "react";
import { getCategorias } from "../../../api/inscription.api";
import "../styles/General.css";

const CategoriesTable = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getCategorias();
        setCategorias(response);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Grados</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((cat) => (
          <tr key={cat.idCategoria}>
            <td>{cat.nombreCategoria}</td>
            <td>
              {cat.grados
                .map((g) => `${g.numeroGrado}° de ${g.nivel}`)
                .join(", ")}
            </td>
            <td>
              <span
                className={`badge ${
                  cat.estadoCategoria ? "badge-success" : "badge-danger"
                }`}
              >
                {cat.estadoCategoria ? "Activo" : "Inactivo"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriesTable;
