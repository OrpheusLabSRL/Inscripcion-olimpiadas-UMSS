import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OlympiansReportTable from "../components/administrationTable/reports/OlympiansReportTable";
import TutorsReportTable from "../components/administrationTable/reports/TutorsReportTable";
import OlympiadsReportTable from "../components/administrationTable/reports/OlympiadsReportTable";
import "../Styles/Reports.css";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [activeReport, setActiveReport] = useState("");
  const reportRef = useRef(null);

  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
  };

  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert("Seleccione un tipo de reporte primero.");
      return;
    }
    setActiveReport(selectedReport);
  };

  const handleGeneratePDF = async () => {
    if (!reportRef.current) {
      alert("No hay reporte para exportar.");
      return;
    }
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Add date and time at top
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${dateStr}    Hora: ${timeStr}`, 10, 10);

    // Find the table element inside reportRef
    const tableElement = reportRef.current.querySelector("table");
    if (!tableElement) {
      alert("No se encontró la tabla para exportar.");
      return;
    }

    // Use html2canvas to capture only the table element
    const canvas = await html2canvas(tableElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add the table image below the date/time text (leave some margin)
    pdf.addImage(imgData, "PNG", 0, 20, pdfWidth, pdfHeight);

    pdf.save(`reporte_${activeReport}.pdf`);
  };

  const renderReportComponent = () => {
    switch (activeReport) {
      case "olympians":
        return <OlympiansReportTable />;
      case "tutors":
        return <TutorsReportTable />;
      case "olympiads":
        return <OlympiadsReportTable />;
      default:
        return null;
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="reports-title">
          <h1>Reportes</h1>
          <p>Visualiza los reportes disponibles del sistema</p>
        </div>

        <div className="reports-controls">
          <select
            value={selectedReport}
            onChange={handleReportChange}
            className="reports-select"
          >
            <option value="">Seleccione el reporte que desea</option>
            <option value="olympians">Olimpistas</option>
            <option value="tutors">Tutores</option>
            <option value="olympiads">Olimpiadas</option>
          </select>

          <button
            className="btn-registrar"
            onClick={handleGenerateReport}
          >
            Generar Reporte
          </button>

          <button
            className="btn-registrar"
            onClick={handleGeneratePDF}
            disabled={!activeReport}
          >
            Generar Reporte PDF
          </button>
        </div>
      </div>

      <div className="reports-content" ref={reportRef}>
        {renderReportComponent()}
      </div>
    </div>
  );
};

export default Reports;

