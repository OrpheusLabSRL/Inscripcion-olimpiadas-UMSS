const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.post('/consultar', async (req, res) => {
    const { carnetIdentidad, correoElectronico } = req.body;

    try {
        // Primero buscar en la tabla Persona
        const personaQuery = `
            SELECT p.idPersona, p.nombres, p.apellidoPaterno, p.apellidoMaterno, p.carnetIdentidad, p.correoElectronico
            FROM Persona p
            WHERE p.carnetIdentidad = ? AND p.correoElectronico = ?
        `;

        const [persona] = await pool.query(personaQuery, [carnetIdentidad, correoElectronico]);

        if (!persona || persona.length === 0) {
            return res.status(404).json({ error: 'No se encontró la persona con los datos proporcionados' });
        }

        // Buscar en la tabla Olimpistas
        const olimpistaQuery = `
            SELECT o.idOlimpista, o.numeroOlimpista
            FROM Olimpistas o
            WHERE o.idPersona = ?
        `;

        const [olimpista] = await pool.query(olimpistaQuery, [persona[0].idPersona]);

        if (!olimpista || olimpista.length === 0) {
            return res.status(404).json({ error: 'No se encontró el olimpista' });
        }

        // Buscar en la tabla Inscripciones
        const inscripcionQuery = `
            SELECT i.idInscripcion, i.idTutorResponsable
            FROM Inscripciones i
            WHERE i.idOlimpista = ?
        `;

        const [inscripcion] = await pool.query(inscripcionQuery, [olimpista[0].idOlimpista]);

        if (!inscripcion || inscripcion.length === 0) {
            return res.status(404).json({ error: 'No se encontró la inscripción' });
        }

        // Buscar en la tabla Boletas_pagos
        const boletaQuery = `
            SELECT bp.estadoInscripcion
            FROM Boletas_pagos bp
            WHERE bp.idTutorResponsable = ?
        `;

        const [boleta] = await pool.query(boletaQuery, [inscripcion[0].idTutorResponsable]);

        if (!boleta || boleta.length === 0) {
            return res.status(404).json({ error: 'No se encontró la boleta de pago' });
        }

        // Preparar la respuesta
        const response = {
            datosPersona: {
                nombres: persona[0].nombres,
                apellidoPaterno: persona[0].apellidoPaterno,
                apellidoMaterno: persona[0].apellidoMaterno,
                carnetIdentidad: persona[0].carnetIdentidad,
                correoElectronico: persona[0].correoElectronico
            },
            datosOlimpista: {
                numeroOlimpista: olimpista[0].numeroOlimpista
            },
            estadoPago: boleta[0].estadoInscripcion === 1 ? 'PAGO PENDIENTE' : 'PAGO REALIZADO'
        };

        res.json(response);

    } catch (error) {
        console.error('Error al consultar inscripción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router; 