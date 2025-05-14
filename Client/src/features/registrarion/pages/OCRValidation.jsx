import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import "../Styles/OCRValidation.css";
import Tesseract from "tesseract.js";

export const OCRValidation = () => {
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [processing, setProcessing] = useState(false);
  const [codigoBoleta, setCodigoBoleta] = useState(null);
  const [boletaExists, setBoletaExists] = useState(null);
  const [montoTotal, setMontoTotal] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setOcrResult("");
    setCodigoBoleta(null);
    setBoletaExists(null);
    setMontoTotal(null);
  };

  const extractCodigoBoleta = (text) => {
    const regex = /nro\.?\s*control:?\s*(\d+)/i;
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const extractPayerName = (text) => {
    // Extract text after "Recibi de:" up to "Por concepto de" or end of line
    const regex = /recibi de:\s*([A-Z\s]+?)(?:\s+por concepto de|$)/i;
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const extractMontoTotal = (text) => {
    // Extract monto total after "Total:Bs" with optional spaces and decimal
    const regex = /total:bs\s*([\d.,]+)/i;
    const match = text.match(regex);
    if (match) {
      // Convert to float, replace comma with dot if needed
      const montoStr = match[1].replace(',', '.');
      const monto = parseFloat(montoStr);
      return isNaN(monto) ? null : monto;
    }
    return null;
  };
  
  const splitPayerName = (name) => {
    if (!name) return { lastNames: null, firstNames: null };
    const parts = name.trim().split(/\s+/);
    let lastNames = "";
    let firstNames = "";
    if (parts.length === 1) {
      lastNames = parts[0];
      firstNames = "";
    } else if (parts.length === 2) {
      lastNames = parts[0];
      firstNames = parts[1];
    } else {
      // Assume first two words are last names, rest are first names
      lastNames = parts.slice(0, 2).join(" ");
      firstNames = parts.slice(2).join(" ");
    }
    return { lastNames, firstNames };
  };

  const checkCodigoBoleta = async (codigo) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/boletaPago/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          codigoBoleta: codigo,
          payerName: extractPayerName(ocrResult),
          montoTotal: montoTotal
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
    setCodigoBoleta(null);
    setBoletaExists(null);

    try {
      const { data } = await Tesseract.recognize(file, "spa", {
        logger: (m) => {
          // Optionally handle progress updates here
          // console.log(m);
        },
      });
      const text = data.text;
      setOcrResult(text);

      const codigo = extractCodigoBoleta(text);
      setCodigoBoleta(codigo);

      // Remove automatic backend check here
      // User will click button to check
      const monto = extractMontoTotal(text);
      setMontoTotal(monto);
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

  // Removed duplicate declaration of checkCodigoBoleta to fix redeclaration error

  const confirmarPago = async (codigo) => {
    if (boletaPaid) {
      alert("La boleta ya fue pagada.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/boletaPago/confirmarPago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigoBoleta: codigo }),
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
    <div className="ocrvalidation-container">
      <h1>Subir foto del comprobante de pago</h1>
      <p>Suba una imagen para validar mediante OCR.</p>
      <div className="ocrvalidation-panel" style={{marginTop: "20px"}}>
        <form onSubmit={handleSubmit} className="ocrvalidation-form" style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start", justifyContent: "center", marginBottom: "20px", width: "660px"}}>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{padding: "0.5rem", borderRadius: "6px", border: "1px solid #1e40af", backgroundColor: "white", color: "black", fontWeight: "600", fontSize: "1rem", cursor: "pointer", height: "40px", width: "660px"}} />
          <PrimaryButton type="submit" value={processing ? "Procesando..." : "Procesar Imagen"} disabled={processing} style={{width: "150px", height: "40px", backgroundColor: "#1e40af", borderColor: "#1e40af", color: "white", fontWeight: "600", fontSize: "1rem", cursor: "pointer"}} />
        </form>
        {codigoBoleta && (
          <div style={{marginTop: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "0.5rem"}}>
            <strong>Código de Boleta detectado:</strong> <span>{codigoBoleta}</span>
          </div>
        )}
          {ocrResult && (() => {
            const payerName = extractPayerName(ocrResult);
            const { lastNames, firstNames } = splitPayerName(payerName);
            return (
              <div style={{marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: "0.5rem"}}>
                <div><strong>Apellidos:</strong> {lastNames ? lastNames : "N/A"}</div>
                <div><strong>Nombres:</strong> {firstNames ? firstNames : "N/A"}</div>
                <div><strong>Monto Total:</strong> {montoTotal ? montoTotal + " Bs." : "N/A"}</div>
              </div>
            );
          })()}
        {codigoBoleta && (
          <>
            <button onClick={() => confirmarPago(codigoBoleta)} style={{marginTop: "10px", marginRight: "10px", width: "150px", height: "40px", borderRadius: "6px", border: "1px solid #1e40af", backgroundColor: "#1e40af", color: "white", fontWeight: "600", fontSize: "1rem", cursor: "pointer", verticalAlign: "middle"}}>
              Confirmar Pago
            </button>
          </>
        )}
        {boletaExists !== null && (
          <div style={{marginTop: "10px", color: boletaExists ? "green" : "red"}}>
            {boletaExists ? (boletaPaid ? "La boleta ya fue pagada." : "La boleta existe en la base de datos.") : "La boleta NO existe en la base de datos."}
          </div>
        )}
        <button className="back-button" onClick={handleBack} style={{marginTop: "20px", width: "150px", height: "40px", borderRadius: "6px", border: "1px solid #1e40af", backgroundColor: "#1e40af", color: "white", fontWeight: "600", fontSize: "1rem", cursor: "pointer"}}>
          Volver
        </button>
      </div>
    </div>
  );
};
