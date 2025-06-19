import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { finishRegistering } from "../../../../api/inscription.api";
import { generatePdfBoleta } from "./pdfgenerator";

//components
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";

export const ListElementInscription = ({ inscription, index }) => {
  const [registering, setRegistering] = useState(true);
  const [tutorId, setTutorId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedTutorId = sessionStorage.getItem("tutorInscripcionId");
    if (!storedTutorId) {
      console.error("ID del tutor no encontrado en sessionStorage.");
      return;
    }
    setTutorId(storedTutorId);
    setRegistering(inscription.olimpistas[0].inscripciones[0].registrandose);
  }, [inscription]);

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
        await finishRegistering(tutorId, inscription.codigoInscripcion);
        setRegistering(false);
        Swal.fire({
          title: "¡Registro finalizado!",
          text: "Ahora puede generar la boleta de pago.",
          icon: "success"
        });
      } catch (error) {
        console.error("Error al finalizar el registro:", error);
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al finalizar el registro.",
          icon: "error"
        });
      }
    }
  };

  const generarBoleta = async () => {
    if (!tutorId) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el ID del tutor.",
        icon: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/boletas/generar/${tutorId}/${inscription.codigoInscripcion}`
      );

      await generatePdfBoleta(response.data);

    } catch (error) {
      console.error("Error al generar la boleta:", error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al generar la boleta. Intente nuevamente.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr key={index}>
      <td>{inscription.codigoInscripcion}</td>
      <td>{"Inscripción " + (index + 1)}</td>
      <td>{inscription.olimpistas.length}</td>
      <td>
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
          <NextPage
            onClick={generarBoleta}
            className="btn-generate-payment"
            disabled={loading}
            value={
              <>
                <i className="bi bi-file-earmark-text" style={{ marginRight: "8px" }}></i>
                {loading ? "Generando..." : "Generar Orden de Pago"}
              </>
            }
          />
        )}
      </td>
    </tr>
  );
};