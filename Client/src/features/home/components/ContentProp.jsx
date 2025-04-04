import "./ContentProp.css"; // Importing styles for the content

function ContentProp() {
  return (
    <main className="container-content">
      <section className="event-description">
        <h2>Olimpiadas Científicas Oh! SanSi</h2>
        <p>
          Descubre y desarrolla tu potencial científico en las áreas más
          fascinantes de la ciencia
        </p>
        <p>Comienza tu Aventura Científica</p>
      </section>
      <section className="areas-competence">
        <h2>Áreas de Competencia</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <div className="category-card">
            <h3>Matemáticas</h3>
            <p>Descripción de la categoría 1.</p>
          </div>
          <div className="category-card">
            <h3>Física</h3>
            <p>Descripción de la inscripción.</p>
          </div>
          <div className="category-card">
            <h3>Química</h3>
            <p>Descripción de la categoría 3.</p>
          </div>
          <div className="category-card">
            <h3>Astronomía</h3>
            <p>Descripción de la categoría 4.</p>
          </div>
        </div>
      </section>

      <section className="registration-process">
        <h2>Proceso de Inscripción</h2>
        <p>Instrucciones sobre cómo inscribirse.</p>
      </section>
      <section className="how-to-register">
        <h2>¿Cómo Inscribirse?</h2>
        <p>Tutorial Paso a Paso.</p>
      </section>
    </main>
  );
}

export default ContentProp;
