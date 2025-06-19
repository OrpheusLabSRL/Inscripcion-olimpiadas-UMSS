//React
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

//Components
import { NextPage } from "../../../../components/Buttons/NextPage";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { ListElement } from "../ListElement/ListElement";
import { data } from "react-router-dom";

//api
export const ListInscription = ({
  dataOlympians,
  codigoInscripcion,
  index,
}) => {
  const [registering, setRegistering] = useState(true);
  const [nameOlimpian, setNameOlimpian] = useState("");

  useEffect(() => {
    setRegistering(dataOlympians[0].inscripciones[0].registrandose);
    setNameOlimpian(
      dataOlympians[0].inscripciones[0].nombreOlimpiada +
      " versión " +
      dataOlympians[0].inscripciones[0].versionOlimpiada
    );
  }, []);

  const onClickAddStudent = () => {
    const studentOlympiad = {
      idOlimpiada: dataOlympians[0].inscripciones[0].idOlimpiada,
      nombreOlimpiada: dataOlympians[0].inscripciones[0].nombreOlimpiada,
      version: dataOlympians[0].inscripciones[0].versionOlimpiada,
    };
    sessionStorage.setItem("prevPage", location.pathname);
    sessionStorage.setItem("codigoInscripcion", codigoInscripcion);
    sessionStorage.setItem("OlympicData", JSON.stringify(studentOlympiad));
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
        // Depurar valores de tutorId y codigoInscripcion
        const tutorId = sessionStorage.getItem("tutorInscripcionId");
        let cleanCodigoInscripcion = "";
        if (typeof codigoInscripcion === "string") {
          cleanCodigoInscripcion = codigoInscripcion.replace(/^\/+/, "");
        } else if (typeof codigoInscripcion === "number") {
          cleanCodigoInscripcion = codigoInscripcion.toString();
        } else {
          cleanCodigoInscripcion = String(codigoInscripcion);
        }
        console.log("codigoInscripcion (clean):", cleanCodigoInscripcion);
        if (!tutorId || !cleanCodigoInscripcion) {
          Swal.fire(
            "Error",
            "Faltan datos necesarios para finalizar el registro.",
            "error"
          );
          return;
        }
        const url = `/api/tutor/${tutorId}/${cleanCodigoInscripcion}/inscripciones/update`;
        await axios.put(url);
        setRegistering(false);
      } catch (error) {
        console.error("Error al finalizar el registro:", error);
      }
    }
  };

  return (
    <div className="container-list-registered">
      <div className="list-header">
        <h1>{"Inscripción " + (index + 1)}</h1>

        <NextPage
          value="+ Agregar Estudiante"
          className={`btn-add-student ${registering ? "" : "btn-add-student-disabled"
            }`}
          to="/register/olympian"
          state={{ from: location.pathname }}
          disabled={!registering}
          onClick={onClickAddStudent}
        />
      </div>
      {nameOlimpian}
      <div className="container-list">
        {dataOlympians.map((estudiante) => (
          <ListElement data={estudiante} key={estudiante.id_olimpista} />
        ))}
      </div>

      <div className="btn-generar-boleta">
        {registering ? (
          <PrimaryButton
            className="btn-add-student"
            onClick={finishRegister}
            value={
              <>
                <i className="bi bi-check-circle-fill" style={{ marginRight: "8px" }}></i>
                Terminar inscripción
              </>
            }
          />
        ) : (
          <>
            <p>Ahora puedes generar la orden de pago</p>
          </>
        )}
      </div>
    </div>
  );
};
