<?php

namespace App\Http\Controllers;

use App\Models\BoletaPago;
use App\Models\Inscripcion;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class BoletaPagoController extends Controller
{
    public function generarDesdeTutor($idTutor)
    {
        $inscripciones = Inscripcion::where('idTutorResponsable', $idTutor)
            ->whereNull('codigoBoleta')
            ->where('estadoInscripcion', 'pendiente') // o el valor que uses
            ->get();

        if ($inscripciones->isEmpty()) {
            return back()->with('error', 'No hay inscripciones pendientes para generar boleta.');
        }

        $montoTotal = 0;
        foreach ($inscripciones as $inscripcion) {
            $montoTotal += $inscripcion->OlimpiadaAreaCategoria->area->costoArea;
        }

        $boleta = BoletaPago::create([
            'idTutor' => $idTutor,
            'fechaEmision' => now(),
            'montoTotal' => $montoTotal,
            'estadoBoletaPago' => true
        ]);

        foreach ($inscripciones as $inscripcion) {
            $inscripcion->codigoBoleta = $boleta->codigoBoleta;
            $inscripcion->save();
        }

        // Cargar relaciones necesarias para el PDF
        $boleta->load(['tutor.persona']);
        $inscripciones->load(['olimpista.persona', 'OlimpiadaAreaCategoria.area']);

        // Generar PDF
        $pdf = Pdf::loadView('pdf.boleta', [
            'boleta' => $boleta,
            'inscripciones' => $inscripciones
        ]);

        return $pdf->download('boleta_pago_' . $boleta->codigoBoleta . '.pdf');
    }
}
