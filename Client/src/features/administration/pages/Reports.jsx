import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload, FiFileText, FiChevronDown } from "react-icons/fi";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import OlympiansReportTable from "../components/administrationTable/reports/OlympiansReportTable";
import TutorsReportTable from "../components/administrationTable/reports/TutorsReportTable";
import OlympiadsReportTable from "../components/administrationTable/reports/OlympiadsReportTable";
import { useNavigate } from "react-router-dom";
import "../Styles/Reports.css";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [activeReport, setActiveReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef(null);

  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
  };

  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert("Por favor seleccione un tipo de reporte primero.");
      return;
    }
    setActiveReport(selectedReport);
  };

  const handleGeneratePDF = async () => {
    if (!reportRef.current) {
      alert("No hay reporte para exportar.");
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // Add header with logo, title and date
      pdf.setFillColor(241, 245, 249);
      pdf.rect(0, 0, pdfWidth, 20, "F");

      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(30, 64, 175);
      pdf.text(`Reporte de ${getReportTitle(activeReport)}`, 15, 15);

      // Add date and time
      const now = new Date();
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `Generado el: ${now.toLocaleDateString()} a las ${now.toLocaleTimeString()}`,
        pdfWidth - 15,
        15,
        { align: "right" }
      );

      // Add table
      const tableElement = reportRef.current.querySelector("table");
      if (!tableElement) {
        alert("No se encontró la tabla para exportar.");
        return;
      }

      const canvas = await html2canvas(tableElement, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 10, 25, pdfWidth - 20, pdfHeight);
      pdf.save(`reporte_${activeReport}_${now.toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Ocurrió un error al generar el PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportTitle = (reportType) => {
    switch (reportType) {
      case "olympians":
        return "Olimpistas";
      case "tutors":
        return "Tutores";
      case "olympiads":
        return "Olimpiadas";
      default:
        return "";
    }
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
        return (
          <div className="reports__empty-state">
            <FiFileText size={48} />
            <h3>No hay reporte seleccionado</h3>
            <p>
              Seleccione un tipo de reporte y haga clic en "Generar Reporte"
            </p>
          </div>
        );
    }
  };

  const navigate = useNavigate();

  return (
    <div className="reports-container">
      <div className="reports__header">
        <div className="reports__title">
          <h1>Reportes del Sistema</h1>
          <p>Genere y exporte reportes detallados de la plataforma</p>
        </div>

        <div className="reports__controls">
          <div className="reports__select-wrapper">
            <FiChevronDown className="reports__select-icon" />

            <select
              value={selectedReport}
              onChange={handleReportChange}
              className="reports__select"
            >
              <option value="">Seleccione un reporte</option>
              <option value="olympians">Olimpistas</option>
              <option value="tutors">Tutores</option>
              <option value="olympiads">Olimpiadas</option>
            </select>
          </div>

          <button
            className="reports__btn reports__btn-generate"
            onClick={handleGenerateReport}
            disabled={!selectedReport}
          >
            Generar Reporte
          </button>

          <button
            className="reports__btn reports__btn-export"
            onClick={handleGeneratePDF}
            disabled={!activeReport || isGenerating}
          >
            {isGenerating ? (
              <span className="reports__spinner"></span>
            ) : (
              <>
                <FiDownload /> Exportar PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="reports__content" ref={reportRef}>
        {activeReport && (
          <div className="reports__content-header">
            <h2>Reporte de {getReportTitle(activeReport)}</h2>
            <span className="reports__timestamp">
              Generado el {new Date().toLocaleDateString()}
            </span>
          </div>
        )}
        {renderReportComponent()}
      </div>
    </div>
  );
};

export default Reports;
