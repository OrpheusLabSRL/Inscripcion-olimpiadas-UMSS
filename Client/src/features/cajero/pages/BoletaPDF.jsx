import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Styles/BoletaPDF.css";

export const BoletaPDF = () => {
  const { token, id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dar un pequeño tiempo para que se muestre el mensaje de carga
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="pdf-loading">
        <div className="loading-content">
          <h2>Cargando PDF...</h2>
          <p>Por favor espere mientras se carga el documento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      <iframe
        src={`http://orpheus.tis.cs.umss.edu.bo/generate_receipt.php?codigo=${id}`}
        className="pdf-viewer"
        title="PDF Boleta"
      />
    </div>
  );
};
