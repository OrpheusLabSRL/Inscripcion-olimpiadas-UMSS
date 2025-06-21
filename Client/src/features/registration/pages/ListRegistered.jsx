//css
import "../Styles/ListRegistered.css";

//Components
import { ListInscription } from "../components/ListInscription/ListInscription";

//react
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//api
import { getDataOlympian } from "../../../api/inscription.api";

export const ListRegistered = () => {
  const [dataInscriptions, setDataInscriptions] = useState([]);
  const location = useLocation();

  const getStudents = async () => {
    const storedTutorId = sessionStorage.getItem("tutorInscripcionId");
    try {
      const res = await getDataOlympian(storedTutorId);
      setDataInscriptions(res.data.data);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
    getStudents();
  }, []);

  return (
    <div className="container-form">
      <h1 className="title-register">Lista de Estudiantes Registrados</h1>
      {dataInscriptions.map((inscription, index) => {
        return (
          <ListInscription
            key={inscription.codigoInscripcion}
            dataOlympians={inscription.olimpistas}
            codigoInscripcion={inscription.codigoInscripcion}
            index={index}
            getStudents={getStudents}
          />
        );
      })}
    </div>
  );
};
