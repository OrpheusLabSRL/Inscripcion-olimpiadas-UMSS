//css
import "./ListRegistered.css";

//Components
import { ListElement } from "../../components/ListElement/ListElement";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//api
import { getDataOlympian } from "../../../../api/inscription.api";

export const ListRegistered = () => {
  const [dataOlympians, setDataOlympians] = useState([]);
  const location = useLocation();
  const tutorId =
    localStorage.getItem("tutorInscripcionId") ??
    location.state?.tutorId ??
    null;

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await getDataOlympian(tutorId);
        setDataOlympians(res.data);
      } catch (error) {
        console.log("Error en la peticion", error);
      }
    };
    getStudents();
  }, []);

  return (
    <div className="container-list-registered">
      <div className="list-header">
        <h1>Estudiantes Registrados</h1>
        <NextPage
          value="+ Agregar Estudiante"
          className="btn-add-student"
          to="/register/olympian"
          state={{ from: location.pathname }}
        />
      </div>
      <div className="container-list">
        {dataOlympians.map((estudiante) => (
          <ListElement data={estudiante} key={estudiante.id_olimpista} />
        ))}
      </div>
    </div>
  );
};
