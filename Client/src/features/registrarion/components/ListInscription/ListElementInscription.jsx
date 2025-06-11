import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
        await finishRegistering(tutorId, inscription.codigoInscripcion);
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
        `http://localhost:8000/api/inscripcion/${inscription.codigoInscripcion}/boleta/${tutorId}`
      );

      const boletaData = response.data;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 850]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const centerX = width / 2;

      const uniWidth = fontBold.widthOfTextAtSize(boletaData.universidad, 14);
      page.drawText(boletaData.universidad, {
        x: centerX - uniWidth / 2,
        y: height - 50,
        size: 14,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      const facWidth = fontBold.widthOfTextAtSize(boletaData.facultad, 12);
      page.drawText(boletaData.facultad, {
        x: centerX - facWidth / 2,
        y: height - 70,
        size: 12,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      const secWidth = fontBold.widthOfTextAtSize(boletaData.secretaria, 12);
      page.drawText(boletaData.secretaria, {
        x: centerX - secWidth / 2,
        y: height - 90,
        size: 12,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Nº ${String(boletaData.inscripcion.codigo_boleta).padStart(4, '0')}`, {
        x: width - 120,
        y: height - 120,
        size: 14,
        font: fontBold,
        color: rgb(1, 0, 0),
      });

      const ordenWidth = fontBold.widthOfTextAtSize('ORDEN DE PAGO', 16);
      page.drawText('ORDEN DE PAGO', {
        x: centerX - ordenWidth / 2,
        y: height - 130,
        size: 16,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Señor(es): ${boletaData.tutor.nombre_completo}`, {
        x: 50,
        y: height - 160,
        size: 12,
        font: font,
      });
      page.drawText(`NIT/CI: ${boletaData.tutor.ci}`, {
        x: 50,
        y: height - 180,
        size: 12,
        font: font,
      });
      page.drawText(`Código de Inscripción: ${boletaData.inscripcion.codigo}`, {
        x: 50,
        y: height - 200,
        size: 12,
        font: font,
      });

      const detalleWidth = fontBold.widthOfTextAtSize('DETALLE DE INSCRIPCIONES', 12);
      page.drawText('DETALLE DE INSCRIPCIONES', {
        x: centerX - detalleWidth / 2,
        y: height - 230,
        size: 12,
        font: fontBold,
      });

      const tableStartY = height - 270;
      const rowHeight = 22;
      const columnWidths = [120, 200, 100, 80];
      const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
      const tableStartX = (width - tableWidth) / 2;

      // Encabezados
      page.drawRectangle({
        x: tableStartX,
        y: tableStartY - 4,
        width: tableWidth,
        height: rowHeight,
        color: rgb(0.2, 0.4, 0.8),
      });

      const headers = ["Carnet de Identidad", "Nombre del Estudiante", "Área", "Precio"];
      let offsetX = tableStartX;
      headers.forEach((header, i) => {
        page.drawText(header, {
          x: offsetX + 5,
          y: tableStartY + 5,
          size: 10,
          font: fontBold,
          color: rgb(1, 1, 1),
        });
        offsetX += columnWidths[i];
      });

      boletaData.olimpistas.forEach((olimpista, i) => {
        const y = tableStartY - rowHeight * (i + 1);
        let x = tableStartX;
        const bgColor = i % 2 === 0 ? rgb(0.97, 0.97, 0.97) : rgb(1, 1, 1);

        // Fondo y borde
        columnWidths.forEach((w) => {
          page.drawRectangle({
            x,
            y: y - 2,
            width: w,
            height: rowHeight,
            color: bgColor,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 0.4,
          });
          x += w;
        });

        // Texto
        const costo = parseFloat(boletaData.area.costo_unitario) || 0;
        const values = [
          olimpista.ci,
          olimpista.nombre_completo.length > 35 ? olimpista.nombre_completo.slice(0, 32) + '...' : olimpista.nombre_completo,
          boletaData.area.nombre,
          `Bs ${costo.toFixed(2)}`
        ];

        x = tableStartX;
        values.forEach((val, j) => {
          page.drawText(val, {
            x: x + 5,
            y: y + 5,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
          x += columnWidths[j];
        });
      });

      const tableEndY = tableStartY - rowHeight * (boletaData.olimpistas.length + 1);
      const totalX = width - 220;

      page.drawText(`Son: ${boletaData.total.monto} Bolivianos`, {
        x: totalX,
        y: tableEndY - 20,
        size: 12,
        font: fontBold,
      });

      page.drawText(`Total de Estudiantes: ${boletaData.total.cantidad_estudiantes}`, {
        x: totalX,
        y: tableEndY - 40,
        size: 12,
        font: fontBold,
      });

      const today = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const fechaFormateada = today.toLocaleDateString('es-ES', options);

      page.drawText(`Cochabamba, ${fechaFormateada}`, {
        x: totalX,
        y: tableEndY - 70,
        size: 12,
        font: font,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `boleta_pago_${boletaData.inscripcion.codigo}.pdf`;
      link.click();

    } catch (error) {
      console.error("Error al generar la boleta:", error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al generar la boleta. Intente nuevamente.',
        icon: 'error'
      });
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
          <NextPage
            onClick={generarBoleta}
            value="Generar Orden de Pago"
            className="btn-generate-payment"
          />
        )}
      </td>
    </tr>
  );
};
