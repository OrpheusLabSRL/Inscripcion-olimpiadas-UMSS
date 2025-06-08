<?php

namespace App\Services;

use App\Models\BoletaPago;
use App\Models\Inscripcion;
use App\Models\Tutor;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class GenerarBoletaService
{
    public function generarBoleta($idTutor, $codigoInscripcion)
    {
        Log::info('Datos recibidos para generar boleta', [$idTutor, $codigoInscripcion]);
        // Verificar si el tutor existe
        $tutor = Tutor::find($idTutor);
        if (!$tutor) {
            throw new \Exception('Tutor no encontrado.');
        }
        // Obtener inscripciones pendientes con relaciones cargadas
        $inscripciones = Inscripcion::with([
            'olimpista.persona',
            'OlimpiadaAreaCategoria.area'
        ])
            ->where('idTutorResponsable', $idTutor)
            ->where('codigoInscripcion', $codigoInscripcion)
            ->get();

        if ($inscripciones->isEmpty()) {
            throw new \Exception('No hay inscripciones pendientes.');
        }

        // Calcular monto total sumando el costo de cada área
        $monto = $inscripciones->sum(function ($inscripcion) {
            return $inscripcion->OlimpiadaAreaCategoria->costo ?? 0;
        });

        // Crear boleta de pago con numeroControl generado (número aleatorio de hasta 6 dígitos)
        $numeroControl = str_pad(strval(random_int(0, 999999)), 6, '0', STR_PAD_LEFT);
        $boleta = BoletaPago::create([
            'idTutor' => $idTutor,
            'fechaEmision' => now()->toDateString(),
            'montoTotal' => $monto,
            'numeroControl' => $numeroControl,
        ]);

        // Asignar código de boleta a cada inscripción
        foreach ($inscripciones as $inscripcion) {
            $inscripcion->codigoBoleta = $boleta->codigoBoleta;
            $inscripcion->save();
        }

        // Generar PDF
        $pdf = Pdf::loadView('boletas.plantillas', [
            'boleta' => $boleta,
            'tutor' => $tutor,
            'inscripciones' => $inscripciones,
            'fecha' => now()->toDateString(),
            'montoTotal' => $boleta->montoTotal,
        ]);

        return $pdf;
    }
}
