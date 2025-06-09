import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import "../Styles/OCRValidation.css";
import Tesseract from "tesseract.js";

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
      fetch(`http://127.0.0.1:8000/api/boletaPago/boletasByTutor/${tutorId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.boletas && data.boletas.length > 0) {
            // Filtrar boletas que no estén pagadas (estadoBoletaPago == 1)
            const pendingBoletas = data.boletas.filter(
              (boleta) => boleta.estadoBoletaPago === 1
            );
            setUploadEnabled(pendingBoletas.length > 0);
          } else {
            setUploadEnabled(false);
          }
        })
        .catch(() => {
          setUploadEnabled(false);
        });
    } else {
      setUploadEnabled(false);
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setOcrResult("");
    setControlBoleta(null);
    setBoletaExists(null);
    setMontoTotal(null);
  };

  const extractControlBoleta = (text) => {
    // Extract numeroControl from noisy string, e.g. "43124asdfad514Nrodsads.Co4532ntrol     -{+´-: dfasfdsa<NroControl>+-´ñ5432-2."
    // Strategy: find "nro" and "control" words ignoring non-alphanumeric chars, then extract following digits
    const regex = /nro[^a-zA-Z0-9]*control[^a-zA-Z0-9]*[:\s\-+´\{\}\.<>\w]*?(\d+)/i;
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };
  
     
  const checkControlBoleta = async (control) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/boletaPago/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          numeroControl: control
        }),
      });
      const data = await response.json();
      setBoletaExists(data.exists);
      setBoletaPaid(data.paid);
      setCodigoBoleta(data.codigoBoleta || null);
      if (!data.codigoBoleta) {
        console.log("No se recibió codigoBoleta desde el backend para el numeroControl:", control);
      }
    } catch (error) {
      setBoletaExists(false);
      setBoletaPaid(false);
      setCodigoBoleta(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor, seleccione un archivo para procesar.");
      return;
    }

    setProcessing(true);
    setOcrResult("");
    setControlBoleta(null);
    setBoletaExists(null);

    try {
      const { data } = await Tesseract.recognize(file, "spa", {
        logger: (m) => {},
      });
      const text = data.text;
      setOcrResult(text);
      console.log("Texto extraído por OCR:", text);

      const control = extractControlBoleta(text);
      setControlBoleta(control);
      if (!control) {
        console.log("No se encontró el número de control en el texto extraído.");
      }

      if (control) {
        await checkControlBoleta(control);
      }
    } catch (error) {
      setOcrResult("Error al procesar la imagen: " + error.message);
      setBoletaExists(false);
      console.log("Error al procesar la imagen:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleBack = () => {
    navigate("/register");
  };

  const [boletaPaid, setBoletaPaid] = useState(false);

  const confirmarPago = async (control) => {
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
      const checkResponse = await fetch("http://127.0.0.1:8000/api/boletaPago/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          numeroControl: control
        }),
      });
      const checkData = await checkResponse.json();
      if (!checkData.exists) {
        alert(
          "La boleta no existe en la base de datos. No se puede confirmar el pago."
        );
        setBoletaExists(false);
        console.log("La boleta no existe en la base de datos para el control:", control);
        return;
      }
      if (checkData.paid) {
        alert("La boleta ya fue pagada.");
        setBoletaPaid(true);
        console.log("La boleta ya fue pagada para el control:", control);
        return;
      }
      const response = await fetch("http://127.0.0.1:8000/api/boletaPago/confirmarPago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numeroControl: control }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.message === "Pago confirmado exitosamente.") {
        setBoletaPaid(true);
        console.log("Pago confirmado exitosamente para el control:", control);
      }
    } catch (error) {
      alert("Error al confirmar el pago: " + error.message);
      console.log("Error al confirmar el pago:", error);
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
          <div
            className="selected-file"
            title={file.name}
          >
            Archivo seleccionado: {file.name}
          </div>
        )}

          <PrimaryButton
            type="submit"
            value={processing ? "Procesando..." : "Procesar Imagen"}
            disabled={processing || !uploadEnabled || !file || file === undefined}
            className="primary-button-custom"
          />
      </form>
      
      {controlBoleta && (
        <button
          onClick={() => confirmarPago(controlBoleta)}
          disabled={!boletaExists || boletaPaid}
          className={`confirmar-pago-button ${(!boletaExists || boletaPaid) ? "disabled" : ""}`}
        >
          Confirmar Pago
        </button>
      )}

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
              : "La boleta existe en la base de datos."
            : "La boleta NO existe en la base de datos."}
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
