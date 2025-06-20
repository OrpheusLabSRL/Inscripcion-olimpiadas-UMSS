<?php

namespace App\Services;

use App\Models\BoletaPago;
use App\Models\Tutor;
use App\Models\Inscripcion;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class ReimprimirBoletaService
{
    public function reimprimirBoleta($codigoBoleta)
    {
        try {
            $boleta = BoletaPago::where('codigoBoleta', $codigoBoleta)->first();

            if (!$boleta) {
                throw new \Exception('Boleta no encontrada.');
            }

            $tutor = Tutor::find($boleta->idTutor);
            $inscripciones = Inscripcion::with([
                'olimpista.persona',
                'OlimpiadaAreaCategoria.area'
            ])->where('codigoBoleta', $codigoBoleta)->get();

            if ($inscripciones->isEmpty()) {
                throw new \Exception('No hay inscripciones asociadas a esta boleta.');
            }

            $pdf = Pdf::loadView('boletas.plantillas', [
                'boleta' => $boleta,
                'tutor' => $tutor,
                'inscripciones' => $inscripciones,
                'fecha' => now()->toDateString(),
                'montoTotal' => $boleta->montoTotal,
            ]);

            return $pdf;
        } catch (\Exception $e) {
            Log::error('Error al reimprimir la boleta: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getBoletaData($codigoBoleta)
    {
        try {
            $boleta = BoletaPago::with(['inscripciones' => function ($query) {
                $query->with(['olimpista.persona', 'olimpiadaAreaCategoria.area', 'olimpiadaAreaCategoria.categoria', 'olimpiadaAreaCategoria.olimpiada']);
            }])->where('codigoBoleta', $codigoBoleta)->first();

            if (!$boleta) {
                throw new \Exception('Boleta no encontrada.');
            }
            
            // Cargar explícitamente la relación del tutor y su persona
            $boleta->load('tutor');
            if ($boleta->tutor) {
                $boleta->tutor->load('persona');
            }

            return $boleta;
        } catch (\Exception $e) {
            Log::error('Error al obtener los datos de la boleta: ' . $e->getMessage());
            throw $e;
        }
    }
}
