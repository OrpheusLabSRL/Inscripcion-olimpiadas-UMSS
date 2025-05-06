//css
import "../Styles/ListRegistered.css";

//Components
import { ListElement } from "../components/ListElement/ListElement";
import { NextPage } from "../../../components/Buttons/NextPage";

//react
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//api
import { getDataOlympian } from "../../../api/inscription.api";

//axios
import axios from "axios";

export const ListRegistered = () => {
  const [dataOlympians, setDataOlympians] = useState([]);
  const [tutorId, setTutorId] = useState(null); 
  const location = useLocation();

  useEffect(() => {
    const storedTutorId = sessionStorage.getItem("tutorInscripcionId");

    if (!storedTutorId) {
      console.error("ID del tutor no encontrado en sessionStorage.");
      return;
    }

    setTutorId(storedTutorId); 

    const getStudents = async () => {
      try {
        const res = await getDataOlympian(storedTutorId);
        setDataOlympians(res.data.data);

        sessionStorage.removeItem("tutorInscripcionId");
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };

    getStudents();
  }, []);

  const generarBoleta = async () => {
    if (!tutorId) {
      alert("No se encontró el ID del tutor.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/boletas/generar/${tutorId}`,
        {
          responseType: "blob", // Esperamos un archivo
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `boleta_pago_${tutorId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        alert("No hay inscripciones pendientes para generar una boleta.");
      } else {
        alert("Ocurrió un error al generar la boleta. Intenta más tarde.");
      }
      console.error("Error al generar la boleta:", error);
    }
  };

  return (
    <div className="container-form">
      <h1 className="title-register">Registro Olimpiadas O! Sansi 2025</h1>
      <div className="container-list-registered">
        <div className="list-header">
          <h1>Estudiantes Registrados</h1>
          <NextPage
            value="+ Agregar Estudiante"
            className="btn-add-student"
            to="/register/olympian"
            state={{ from: location.pathname }}
            onClick={() =>
              sessionStorage.setItem("prevPage", location.pathname)
            }
          />
          <button
            className="btn-primary btn-next-page btn-add-student"
            onClick={generarBoleta}
          >
            Generar Boleta
          </button>
        </div>
        <div className="container-list">
          {dataOlympians.map((estudiante) => (
            <ListElement data={estudiante} key={estudiante.id_olimpista} />
          ))}
        </div>
      </div>
    </div>
  );
};
