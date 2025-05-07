//css
import "../Styles/ListRegistered.css";

//Components
import { ListElement } from "../components/ListElement/ListElement";
import { NextPage } from "../../../components/Buttons/NextPage";

//react
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

//api
import {
  getDataOlympian,
  finishRegistering,
} from "../../../api/inscription.api";

//axios
import axios from "axios";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";

export const ListRegistered = () => {
  const [dataOlympians, setDataOlympians] = useState([]);
  const [registering, setRegistering] = useState(true);
  const location = useLocation();
  const tutorId = sessionStorage.getItem("tutorInscripcionId");

  useEffect(() => {
    const tutorId = sessionStorage.getItem("tutorInscripcionId");
    if (!tutorId) {
      console.error("ID del tutor no encontrado en sessionStorage.");

      return;
    }

    const getStudents = async () => {
      try {
        const res = await getDataOlympian(tutorId);
        setRegistering(res.data.data[0].inscripciones[0].registrandose);
        setDataOlympians(res.data.data);
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

  const finishRegister = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro que quieres finalizar el registro?",
      text: "Ya no podra registrar mas estudiantes y podra generar la boleta de pago.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    });
    if (confirmacion.isConfirmed) {
      try {
        await finishRegistering(tutorId);
        setRegistering(false);
      } catch (error) {
        console.error("Error al finalizar el registro:", error);
      }
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
            className={`btn-add-student ${
              registering ? "" : "btn-add-student-disabled"
            }`}
            to="/register/olympian"
            state={{ from: location.pathname }}
            disabled={!registering}
            onClick={() =>
              sessionStorage.setItem("prevPage", location.pathname)
            }
          />
        </div>
        <div className="container-list">
          {dataOlympians.map((estudiante) => (
            <ListElement data={estudiante} key={estudiante.id_olimpista} />
          ))}
        </div>

        <div className="btn-generar-boleta">
          {registering ? (
            <PrimaryButton
              value="Terminar inscripción"
              className="btn-add-student"
              onClick={finishRegister}
            />
          ) : (
            <NextPage onClick={generarBoleta} value="Generar Boleta" />
          )}
        </div>
      </div>
    </div>
  );
};
