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
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setOcrResult("");
    setCodigoBoleta(null);
    setBoletaExists(null);
  };

  const extractCodigoBoleta = (text) => {
    const regex = /Nro\. Control:\s*(\d+)/i;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  const checkCodigoBoleta = async (codigo) => {
    try {
      const response = await fetch("/api/boletaPago/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigoBoleta: codigo }),
      });
      const data = await response.json();
      setBoletaExists(data.exists);
    } catch (error) {
      setBoletaExists(false);
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

  return (
    <div className="ocrvalidation-container">
      <h1>Validación OCR</h1>
      <p>Suba una imagen o documento para validar mediante OCR.</p>
      <form onSubmit={handleSubmit} className="ocrvalidation-form">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <PrimaryButton type="submit" value={processing ? "Procesando..." : "Procesar OCR"} disabled={processing} />
      </form>
      {ocrResult && (
        <div className="ocr-result-panel" style={{marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f9f9f9", maxHeight: "300px", overflowY: "auto"}}>
          <h2>Texto extraído:</h2>
          <div className="ocr-result-text" style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
            {ocrResult}
          </div>
        </div>
      )}
      {codigoBoleta && (
        <div style={{marginTop: "10px"}}>
          <strong>Código de Boleta detectado:</strong> {codigoBoleta}
        </div>
      )}
      {codigoBoleta && (
        <button onClick={() => checkCodigoBoleta(codigoBoleta)} style={{marginTop: "10px"}}>
          Comprobar Boleta
        </button>
      )}
      {boletaExists !== null && (
        <div style={{marginTop: "10px", color: boletaExists ? "green" : "red"}}>
          {boletaExists ? "La boleta existe en la base de datos." : "La boleta NO existe en la base de datos."}
        </div>
      )}
      <button className="back-button" onClick={handleBack} style={{marginTop: "20px"}}>Volver</button>
    </div>
  );
};
