import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import { FaShapes, FaLayerGroup } from "react-icons/fa";
import "../Styles/BaseData.css";

const ManageBaseData = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Áreas",
      description:
        "Gestiona las áreas principales de competencia como Matemáticas, Física, Química, etc.",
      icon: <FaShapes size={24} />,
      route: "/admin/areas",
    },
    {
      title: "Categorías",
      description:
        "Define las categorías por nivel, edad o tipo de participación dentro de cada área.",
      icon: <FaLayerGroup size={24} />,
      route: "/admin/categorias",
    },
  ];

  const goBackHome = () => {
    navigate("/admin/home");
  };

  return (
    <div className="base-config-container">
      <div className="base-config-back">
        <BackButton onClick={goBackHome} className="base-config-back-button">
          Volver al inicio
        </BackButton>
      </div>

      <div className="base-config-header">
        <h1 className="base-config-title">Datos Base</h1>
        <p className="base-config-subtitle">
          Configura las áreas, categorías y el formulario de inscripción
        </p>
      </div>

      <div className="base-config-grid">
        {items.map((item, idx) => (
          <div key={idx} className="base-config-card">
            <div className="base-config-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button
              className="base-config-button"
              onClick={() => navigate(item.route)}
            >
              Gestionar {item.title.toLowerCase()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBaseData;
