import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import "../Styles/OCRValidation.css";
import Tesseract from "tesseract.js";
import {
  extractControlBoleta,
  checkControlBoleta,
  confirmarPago,
  fetchPendingBoletas,
} from "../services/OCRValidationService";

export const OCRValidation = () => {
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [processing, setProcessing] = useState(false);
  const [controlBoleta, setControlBoleta] = useState(null);
  const [boletaExists, setBoletaExists] = useState(null);
  const [montoTotal, setMontoTotal] = useState(null);
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [codigoBoleta, setCodigoBoleta] = useState(null);

  useEffect(() => {
    // Collapse sidebar on mobile devices
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false); // Sidebar collapsed on mobile (false means collapsed)
      } else {
        setSidebarOpen(true); // Sidebar expanded on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const tutorId = sessionStorage.getItem("tutorInscripcionId");
    if (tutorId) {
      fetchPendingBoletas(tutorId).then((enabled) => {
        setUploadEnabled(enabled);
      });
    } else {
      setUploadEnabled(false);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOcrResult("");
    setControlBoleta(null);
    setBoletaExists(null);
    setMontoTotal(null);

    if (selectedFile) {
      processImage(selectedFile);
    }
  };

  const processImage = async (imageFile) => {
    setProcessing(true);
    setOcrResult("");
    setControlBoleta(null);
    setBoletaExists(null);

    try {
      const { data } = await Tesseract.recognize(imageFile, "spa", {
        logger: (m) => {},
      });
      const text = data.text;
      setOcrResult(text);
      console.log("Texto extraído por OCR:", text);

      const control = extractControlBoleta(text);
      setControlBoleta(control);
      if (!control) {
        console.log("No se encontró el número de control en el texto extraído.");
        setBoletaExists(false);
      }

      if (control) {
        const data = await checkControlBoleta(control);
        setBoletaExists(data.exists);
        setBoletaPaid(data.paid);
      }
    } catch (error) {
      setOcrResult("Error al procesar la imagen: " + error.message);
      setBoletaExists(false);
      console.log("Error al procesar la imagen:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor, seleccione un archivo para procesar.");
      return;
    }
    await processImage(file);
  };

  const handleBack = () => {
    navigate("/register");
  };

  const [boletaPaid, setBoletaPaid] = useState(false);

  const handleConfirmarPago = async (control) => {
    if (!control) {
      alert("Código de control no detectado. Por favor, procese una imagen válida.");
      console.log("Intento de confirmar pago sin código de control detectado.");
      return;
    }
    if (boletaPaid) {
      alert("La boleta ya fue pagada.");
      console.log("La boleta ya fue pagada.");
      return;
    }
    try {
      const data = await confirmarPago(control);
      alert(data.message);
      if (data.message === "Pago confirmado exitosamente.") {
        setBoletaPaid(true);
        console.log("Pago confirmado exitosamente para el control:", control);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={`ocrvalidation-container ${sidebarOpen ? "sidebar-collapsed" : ""}`}>
      <h1>Subir foto del comprobante de pago</h1>
      <p>Sube una foto clara de tu comprobante de pago para validar tu inscripción automáticamente.</p>
      <div className="reports__content">
        <form
          onSubmit={handleSubmit}
          className="ocrvalidation-form"
        >
          {/* Contenedor del input de archivo personalizado */}
          <div className={`file-input-wrapper ${uploadEnabled ? "" : "disabled"}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={!uploadEnabled}
              className={`file-ocr-input ${uploadEnabled ? "" : "disabled"}`}
            />
            <div className="file-input-label">
              Seleccionar imagen
            </div>
          </div>
          {file && (
            <div className="status-message success" title={file.name}>
              Archivo seleccionado: {file.name}
            </div>
          )}

            {processing && (
              <PrimaryButton
                type="submit"
                value="Procesando..."
                disabled={true}
                className="primary-button-custom"
              />
            )}
        </form>
        
        {/* Botones centrados y modernos */}
        <div className="boleta-btns-group">
          {controlBoleta && (
            <button
              onClick={() => handleConfirmarPago(controlBoleta)}
              disabled={!boletaExists || boletaPaid}
              className={`boleta-center-btn${(!boletaExists || boletaPaid) ? ' disabled' : ''}`}
            >
              Confirmar Pago
            </button>
          )}
          <button
            className="boleta-center-btn"
            onClick={handleBack}
          >
            Volver
          </button>
        </div>

        {uploadEnabled === false && (
          <div className="status-message error">
            No tiene boletas de pago pendientes. No puede subir comprobantes hasta que tenga al menos una boleta pendiente.
          </div>
        )}

        {boletaExists !== null && (
          <div className={`status-message ${boletaExists ? "success" : "error"}`}>
            {boletaExists
              ? boletaPaid
                ? "La boleta ya fue pagada."
                : "La boleta se verifico con exito y esta lista para que confirme el pago."
              : "La boleta que usted trata de verificar no existe o la imagen no es clara para su procesamiento. Por favor, intente con una foto más nítida y asegúrese de que el comprobante sea válido."}
          </div>
        )}

      {codigoBoleta && (
        <div className="aclaracion">
          Aclaracion: OF {codigoBoleta}
        </div>
      )}
    </div>
  </div>
); 
};
