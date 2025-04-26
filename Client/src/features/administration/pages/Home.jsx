import "../Styles/Home.css";

export default function Home() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Control</h1>
        <p>Bienvenido de nuevo, Juan Perez</p>
      </div>

      <div className="user-card">
        <div className="user-avatar">
          <span role="img" aria-label="user">
            👤
          </span>
        </div>
        <div className="user-info">
          <h2>Juan Perez</h2>
          <p>Administrador Principal</p>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Nombre de la Olimpiada Actual</h3>
          <p className="big-text">O!SansInvierno</p>
          <p>Finaliza en 3 meses</p>
        </div>
        <div className="summary-card">
          <h3>Áreas Registradas</h3>
          <p className="big-text">6</p>
          <p>Aún se pueden aumentar</p>
        </div>
        <div className="summary-card">
          <h3>Participantes</h3>
          <p className="big-text">500</p>
          <p>+20% respecto al mes anterior</p>
        </div>
        <div className="summary-card">
          <h3>Pagos Pendientes</h3>
          <p className="big-text">3</p>
          <p>Aún le quedan 3 meses para pagar</p>
        </div>
      </div>

      <h2 className="section-title">Acciones Rápidas</h2>

      <div className="actions-section">
        <div className="action-card">
          <h3>Gestionar Olimpiadas</h3>
          <p>Crea, edita, borra</p>
          <button>IR A OLIMPIADAS</button>
        </div>
        <div className="action-card">
          <h3>Áreas y Categorías</h3>
          <p>Crea, edita, borra</p>
          <button>IR A ÁREAS Y CATEGORÍAS</button>
        </div>
        <div className="action-card">
          <h3>Generar Reportes</h3>
          <p>Genera reportes personalizados con filtros</p>
          <button>GENERAR REPORTES</button>
        </div>
      </div>
    </div>
  );
}
