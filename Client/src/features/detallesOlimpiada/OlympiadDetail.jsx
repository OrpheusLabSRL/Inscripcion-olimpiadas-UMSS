import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOlimpiadas, getAreasCategoriasPorOlimpiada } from "../../api/Administration.api";
import "../detallesOlimpiada/OlympiadDetail.css";
import HeaderProp from "../home_usuario/components/HeaderProp";
import Footer from "../home_usuario/components/Footer";

const OlympiadDetail = () => {
  const { id } = useParams();
  const [olympiad, setOlympiad] = useState(null);
  const [areasCategorias, setAreasCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener olimpiada
        const allOlympiads = await getOlimpiadas();
        // getOlimpiadas devuelve { data: [...] }
        const found = allOlympiads.data.find(o => o.idOlimpiada.toString() === id);
        setOlympiad(found);

        // 2. Obtener áreas y categorías asociadas a esta olimpiada
        const responseAreasCat = await getAreasCategoriasPorOlimpiada(id);
        // Según tu API, puede venir en response.data o directamente en response
        const areasCategoriasData = responseAreasCat.data || responseAreasCat;
        setAreasCategorias(areasCategoriasData);

      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Cargando información de la olimpiada...</div>;
  if (!olympiad) return <div>No se encontró la olimpiada</div>;

  return (
    <div className="olympiad-detail-page">
      <HeaderProp />
      <div className="olympiad-detail-content">
        <h1>{olympiad.nombreOlimpiada}</h1>
        <p><strong>Versión:</strong> {olympiad.version}</p>
        <p><strong>Inicio:</strong> {olympiad.fechaInicioOlimpiada}</p>
        <p><strong>Fin:</strong> {olympiad.fechaFinOlimpiada}</p>

        <h2>Áreas y Categorías Asociadas</h2>
        {areasCategorias.length === 0 ? (
          <p>No hay áreas o categorías asociadas a esta olimpiada.</p>
        ) : (
          <ul>
            {areasCategorias.map((area) => (
              <li key={area.idArea}>
                <strong>Área:</strong> {area.nombreArea} <br />
                <p>Descripción: {area.descripcionArea}</p>

                <strong>Categorías:</strong>
                <ul>
                  {area.categorias.map((categoria) => (
                    <li key={categoria.idCategoria}>
                      {categoria.nombreCategoria} - Costo: {categoria.costo}
                    </li>
                  ))}
                </ul>
              </li>
            ))}

          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OlympiadDetail;
