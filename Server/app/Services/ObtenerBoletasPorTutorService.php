<?php

namespace App\Services;

use App\Models\BoletaPago;

class ObtenerBoletasPorTutorService
{
    public function obtenerBoletasPorTutor($tutorId)
    {
        if (!$tutorId) {
            throw new \Exception('Tutor ID no proporcionado.');
        }

        $boletas = BoletaPago::where('idTutor', $tutorId)->get();

        return $boletas;
    }
}
