<?php

namespace App\Http\Controllers;

use App\Models\BoletaPago;
use App\Models\Inscripcion;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class BoletaPagoController extends Controller
{


public function generarBoleta($idTutor)
{
    try {
        // Verificar si el tutor existe
        $tutor = Tutor::find($idTutor);
        if (!$tutor) {
            return response()->json(['message' => 'Tutor no encontrado.'], 404);
        }

        // Obtener inscripciones sin boleta
        $inscripciones = Inscripcion::where('idTutorResponsable', $idTutor)->get();

        if ($inscripciones->isEmpty()) {
            return response()->json(['message' => 'No hay inscripciones pendientes.'], 404);
        }

        // Calcular monto total
        $monto = $inscripciones->count() * 15;

        // Crear boleta de pago
        $boleta = BoletaPago::create([
            'idTutor' => $idTutor,
            'fechaEmision' => now()->toDateString(),
            'montoTotal' => $monto,
        ]);

        // Asignar código de boleta a cada inscripción
        foreach ($inscripciones as $inscripcion) {
            $inscripcion->codigoBoleta = $boleta->codigoBoleta;
            $inscripcion->save();
        }

        // Generar el PDF
        $pdf = Pdf::loadView('boletas.plantillas', [
            'boleta' => $boleta,
            'tutor' => $tutor,
            'inscripciones' => $inscripciones,
            'fecha' => now()->toDateString(),
            'montoTotal' => $boleta->montoTotal,
        ]);
        

        return $pdf->download("boleta_pago_{$boleta->codigoBoleta}.pdf");

    } catch (\Exception $e) {
        Log::error('Error al generar la boleta: ' . $e->getMessage());
        return response()->json(['message' => 'Error interno al generar la boleta.'], 500);
    }
}

}
