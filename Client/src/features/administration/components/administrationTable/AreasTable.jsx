import React, { useEffect, useState } from "react";
import { getAreas } from "../../../../api/Administration.api";
import "../../Styles/General.css";

const AreasTable = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setAreas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="2">Cargando áreas...</td>
          </tr>
        ) : areas.length > 0 ? (
          areas.map((area) => (
            <tr key={area.idArea}>
              <td>{area.nombreArea}</td>
              <td>{area.descripcionArea || "—"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2">No hay áreas registradas.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AreasTable;
