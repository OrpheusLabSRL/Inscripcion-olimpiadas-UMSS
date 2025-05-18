//React
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

//Components
import { NextPage } from "../../../../components/Buttons/NextPage";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { ListElement } from "../ListElement/ListElement";

//api
import { finishRegistering } from "../../../../api/inscription.api";

export const ListInscription = ({
  dataOlympians,
  codigoInscripcion,
  index,
}) => {
  const [registering, setRegistering] = useState(true);
  const [tutorId, setTutorId] = useState(null);

  useEffect(() => {
    const storedTutorId = sessionStorage.getItem("tutorInscripcionId");

    if (!storedTutorId) {
      console.error("ID del tutor no encontrado en sessionStorage.");
      return;
    }
    setTutorId(storedTutorId);
    setRegistering(dataOlympians[0].inscripciones[0].registrandose);
  }, []);

  const onClickAddStudent = () => {
    sessionStorage.setItem("prevPage", location.pathname);
    sessionStorage.setItem("codigoInscripcion", codigoInscripcion);
  };

  const finishRegister = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro que quieres finalizar el registro?",
      text: "Ya no podrá registrar más estudiantes y podrá generar la boleta de pago.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await finishRegistering(
          sessionStorage.getItem("tutorInscripcionId"),
          codigoInscripcion
        );
        setRegistering(false);
      } catch (error) {
        console.error("Error al finalizar el registro:", error);
      }
    }
  };

  const generarBoleta = async () => {
    if (!tutorId) {
      alert("No se encontró el ID del tutor.");
      return;
    }

    try {
      console.log(codigoInscripcion);
      const response = await axios.get(
        `http://localhost:8000/api/boletas/generar/${tutorId}/${codigoInscripcion}/get`,
        {
          responseType: "blob",
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
    <div className="container-list-registered">
      <div className="list-header">
        <h1>{"Inscripción " + (index + 1)}</h1>
        <h2>Estudiantes Registrados</h2>

        <NextPage
          value="+ Agregar Estudiante"
          className={`btn-add-student ${
            registering ? "" : "btn-add-student-disabled"
          }`}
          to="/register/olympian"
          state={{ from: location.pathname }}
          disabled={!registering}
          onClick={onClickAddStudent}
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
          <>
            <NextPage onClick={generarBoleta} value="Generar Boleta" />
            <NextPage to="/comprobar-boleta" value="Subir comprobante" />
          </>
        )}
      </div>
    </div>
  );
};
