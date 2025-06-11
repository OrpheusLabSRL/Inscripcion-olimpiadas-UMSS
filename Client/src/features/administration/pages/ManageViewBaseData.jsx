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
    <div className="baseConfigContainer">
      <div className="baseConfigBack">
        <BackButton onClick={goBackHome} className="baseConfigBackButton">
          Volver al inicio
        </BackButton>
      </div>

      <div className="baseConfigHeader">
        <h1 className="baseConfigTitle">Datos Base</h1>
        <p className="baseConfigSubtitle">
          Configura las áreas, categorías y el formulario de inscripción
        </p>
      </div>

      <div className="baseConfigGrid">
        {items.map((item, idx) => (
          <div key={idx} className="baseConfigCard">
            <div className="baseConfigIcon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button
              className="baseConfigButton"
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
