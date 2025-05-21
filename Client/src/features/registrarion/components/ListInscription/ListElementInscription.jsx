//react
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

//components
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";

//api
import { finishRegistering } from "../../../../api/inscription.api";

export const ListElementInscription = ({ inscription, index }) => {
  const [registering, setRegistering] = useState(true);
  const [tutorId, setTutorId] = useState(null);

  useEffect(() => {
    const storedTutorId = sessionStorage.getItem("tutorInscripcionId");

    if (!storedTutorId) {
      console.error("ID del tutor no encontrado en sessionStorage.");
      return;
    }
    setTutorId(storedTutorId);
    setRegistering(inscription.olimpistas[0].inscripciones[0].registrandose);
  }, []);

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
          inscription.codigoInscripcion
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
      const response = await axios.get(
        `http://localhost:8000/api/boletas/generar/${tutorId}/${inscription.codigoInscripcion}/get`,
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
    <tr key={index}>
      <td>{inscription.codigoInscripcion}</td>
      <td>{"Inscripción " + (index + 1)}</td>
      <td>{inscription.olimpistas.length}</td>
      <td>
        {registering ? (
          <PrimaryButton
            value="Terminar inscripción"
            className="btn-generate-payment"
            onClick={finishRegister}
          />
        ) : (
          <>
            <NextPage
              onClick={generarBoleta}
              value="Generar Orden de Pago"
              className="btn-generate-payment"
            />
          </>
        )}
      </td>
    </tr>
  );
};
