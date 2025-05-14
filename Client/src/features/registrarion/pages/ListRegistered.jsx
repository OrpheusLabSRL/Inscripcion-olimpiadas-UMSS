//css
import "../Styles/ListRegistered.css";

//Components
import { ListInscription } from "../components/ListInscription/ListInscription";

//react
import { useEffect, useState } from "react";

//api
import { getDataOlympian } from "../../../api/inscription.api";

export const ListRegistered = () => {
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
    <div className="container-form">
      <h1 className="title-register">Registro Olimpiadas O! Sansi 2025</h1>
      {dataInscriptions.map((inscription, index) => {
        return (
          <ListInscription
            key={inscription.codigoInscripcion}
            dataOlympians={inscription.olimpistas}
            codigoInscripcion={inscription.codigoInscripcion}
            index={index}
          />
        );
      })}
    </div>
  );
};
