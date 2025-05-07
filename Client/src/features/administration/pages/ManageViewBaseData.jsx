// src/features/administration/pages/ManageBaseData.jsx
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/Buttons/BackButton.jsx";
import "../Styles/BaseData.css";

const ManageBaseData = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Áreas",
      description:
        "Gestiona las áreas principales de competencia como Matemáticas, Física, Química, etc.",
      icon: "",
      route: "/admin/areas",
    },
    {
      title: "Categorías",
      description:
        "Define las categorías por nivel, edad o tipo de participación dentro de cada área.",
      icon: "",
      route: "/admin/categorias",
    },
  ];

  const goBackHome = () => {
    navigate("/admin/home");
  };

  return (
    <div
      style={{
        padding: "2rem",
        color: "#213448",
        backgroundColor: " #a2bfcb",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <BackButton onClick={goBackHome} className="back-button">
          Volver
        </BackButton>
      </div>

      <h1 style={{ color: "#213448" }}>Datos Base</h1>
      <p>Configura las áreas, categorías y el formulario de inscripción</p>

      <div className="base-grid">
        {items.map((item, idx) => (
          <div key={idx} className="card-item">
            <div className="card-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className="add-button" onClick={() => navigate(item.route)}>
              Visualizar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBaseData;
