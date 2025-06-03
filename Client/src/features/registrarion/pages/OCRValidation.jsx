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
    } catch (error) {
      setBoletaExists(false);
      setBoletaPaid(false);
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

      const control = extractControlBoleta(text);
      setControlBoleta(control);

      if (control) {
        await checkControlBoleta(control);
      }
    } catch (error) {
      setOcrResult("Error al procesar la imagen: " + error.message);
      setBoletaExists(false);
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
      return;
    }
    if (boletaPaid) {
      alert("La boleta ya fue pagada.");
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
        return;
      }
      if (checkData.paid) {
        alert("La boleta ya fue pagada.");
        setBoletaPaid(true);
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
      }
    } catch (error) {
      alert("Error al confirmar el pago: " + error.message);
    }
  };

  return (
    <div className={`ocrvalidation-container ${sidebarOpen ? "sidebar-collapsed" : ""}`}>
      <h1>Subir foto del comprobante de pago</h1>
      <p>Suba una imagen para validar mediante OCR.</p>
      <div className="reports__content" style={{ marginTop: "20px" }}>
        <form
          onSubmit={handleSubmit}
          className="ocrvalidation-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "stretch",
            justifyContent: "center",
            marginBottom: "20px",
            width: "100%",
            maxWidth: "660px",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #1e40af",
              backgroundColor: "white",
              color: "black",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: "pointer",
              height: "40px",
              width: "100%",
              maxWidth: "660px",
            }}
            disabled={!uploadEnabled}
          />
          <PrimaryButton
            type="submit"
            value={processing ? "Procesando..." : "Procesar Imagen"}
            disabled={processing || !uploadEnabled}
            style={{
              width: "150px",
              height: "40px",
              backgroundColor: "#1e40af",
              borderColor: "#1e40af",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          />
        </form>
        {ocrResult && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <div>
              <strong>Código de Control detectado:</strong>{" "}
              <span>{controlBoleta ? controlBoleta : "N/A"}</span>
            </div>
          </div>
        )}
        {controlBoleta && (
          <>
            <button
              onClick={() => confirmarPago(controlBoleta)}
              disabled={!boletaExists || boletaPaid}
              style={{
                marginTop: "10px",
                marginRight: "10px",
                width: "150px",
                height: "40px",
                borderRadius: "6px",
                border: "1px solid #1e40af",
                backgroundColor: !boletaExists || boletaPaid ? "#a0aec0" : "#1e40af",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: !boletaExists || boletaPaid ? "not-allowed" : "pointer",
                verticalAlign: "middle",
              }}
            >
              Confirmar Pago
            </button>
          </>
        )}
        {uploadEnabled === false && (
          <div style={{ marginTop: "10px", color: "red" }}>
            No tiene boletas de pago pendientes. No puede subir comprobantes hasta que tenga al menos una boleta pendiente.
          </div>
        )}
        {boletaExists !== null && (
          <div style={{ marginTop: "10px", color: boletaExists ? "green" : "red" }}>
            {boletaExists
              ? boletaPaid
                ? "La boleta ya fue pagada."
                : "La boleta existe en la base de datos."
              : "La boleta NO existe en la base de datos."}
          </div>
        )}
        <button
          className="back-button"
          onClick={handleBack}
          style={{
            marginTop: "20px",
            width: "150px",
            height: "40px",
            borderRadius: "6px",
            border: "1px solid #1e40af",
            backgroundColor: "#1e40af",
            color: "white",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Volver
        </button>
      </div>
    </div>
  );
};
