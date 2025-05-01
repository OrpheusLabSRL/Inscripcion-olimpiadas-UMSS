const express = require('express');
const cors = require('cors');
const app = express();
const consultarInscripcionRoutes = require('./routes/consultarInscripcion');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/consultar-inscripcion', consultarInscripcionRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 