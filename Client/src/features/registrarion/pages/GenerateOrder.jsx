//react
import { useState, useEffect } from "react";

//Components
import { ListElementInscription } from "../components/ListInscription/ListElementInscription";

//Api
import { getDataOlympian } from "../../../api/inscription.api";

export const GenerateOrder = () => {
  const [dataInscriptions, setDataInscriptions] = useState([]);

  useEffect(() => {
    const storedTutorId = sessionStorage.getItem("tutorInscripcionId");
    const getStudents = async () => {
      try {
        const res = await getDataOlympian(storedTutorId);
        setDataInscriptions(res.data.data);
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };
    getStudents();
  }, []);

  return (
    <div className="container-list-registered">
      <div className="list-inscription-header">
        <h2>Lista de Inscripciones</h2>
        <table className="container-table-list">
          <thead>
            <tr>
              <th>Codigo de inscripción</th>
              <th>N°</th>
              <th>Cantidad de Estudiantes</th>
              <th style={{ textAlign: "center" }}>Accion</th>
            </tr>
          </thead>
          <tbody>
            {dataInscriptions.map((inscription, index) => {
              return (
                <ListElementInscription
                  inscription={inscription}
                  index={index}
                  key={index}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
