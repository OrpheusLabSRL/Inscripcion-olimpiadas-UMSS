import React, { useEffect, useState } from "react";
import { getOlimpiadas } from "../../../../api/inscription.api";
import OlympiadsModal from "../administrationModal/OlympiadsModal";
import "../../Styles/General.css";

const OlympiadsTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOlympiad, setSelectedOlympiad] = useState(null);

  const fetchOlimpiads = async () => {
    try {
      const data = await getOlimpiadas();
      setOlympiads(data.data);
      console.log("Respuesta cruda de la API:", data.data);
    } catch (error) {
      setOlympiads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOlimpiads();
  }, []);

  const handleEdit = (olympiad) => {
    setSelectedOlympiad(olympiad);
    setIsModalOpen(true);
  };

  if (loading) return <p>Cargando olimpiadas...</p>;

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {olympiads.map((item) => (
            <tr key={item.idOlimpiada}>
              <td>{item.nombreOlimpiada}</td>
              <td>{item.fechaInicioOlimpiada}</td>
              <td>{item.fechaFinOlimpiada}</td>
              <td>
                <span
                  className={`badge badge-${
                    item.estadoOlimpiada ? "success" : "danger"
                  }`}
                >
                  {item.estadoOlimpiada ? "Activo" : "Finalizado"}
                </span>
              </td>
              <td>
                <button onClick={() => handleEdit(item)}>👁️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <OlympiadsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        olimpiada={selectedOlympiad}
      />
    </>
  );
};

export default OlympiadsTable;
