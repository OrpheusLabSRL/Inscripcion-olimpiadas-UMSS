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

            // Obtener inscripciones pendientes con relaciones cargadas
            $inscripciones = Inscripcion::with([
                'olimpista.persona',
                'OlimpiadaAreaCategoria.area'
            ])
                ->where('idTutorResponsable', $idTutor)
                ->whereNull('codigoBoleta')
                ->get();

            if ($inscripciones->isEmpty()) {
                return response()->json(['message' => 'No hay inscripciones pendientes.'], 404);
            }

            // Calcular monto total sumando el costo de cada área
            $monto = $inscripciones->sum(function($inscripcion) {
                return $inscripcion->OlimpiadaAreaCategoria->area->costoArea ?? 0;
            });

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

            // Generar PDF
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

    public function generarPago(Request $request)
    {
        $codigoBoleta = $request->input('codigoBoleta');
        $payerName = $request->input('payerName');
        $montoTotal = $request->input('montoTotal');
        $codigoBoleta = intval(trim($codigoBoleta));
        $montoTotal = floatval($montoTotal);
        \Log::info('Checking codigoBoleta: ' . $codigoBoleta . ', payerName: ' . $payerName . ', montoTotal: ' . $montoTotal);

        // Normalize strings: lowercase and remove accents
        $normalize = function ($str) {
            $str = mb_strtolower($str, 'UTF-8');
            $str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);
            return $str;
        };

        $payerNameNormalized = $normalize($payerName);
        // Remove punctuation and extra spaces from payerNameNormalized
        $payerNameNormalized = preg_replace('/[^\p{L}\p{N}\s]/u', '', $payerNameNormalized);
        $payerNameNormalized = preg_replace('/\s+/', ' ', $payerNameNormalized);
        $payerNameNormalized = trim($payerNameNormalized);

        $nameParts = preg_split('/\s+/', $payerNameNormalized);
        if (count($nameParts) < 2) {
            return response()->json(['exists' => false]);
        }

        // Query to check if boleta exists with matching codigoBoleta, payer name parts, and montoTotal
        $boleta = \DB::table('boletas_pagos')
            ->join('tutores', 'boletas_pagos.idTutor', '=', 'tutores.idPersona')
            ->join('personas', 'tutores.idPersona', '=', 'personas.idPersona')
            ->where('boletas_pagos.codigoBoleta', $codigoBoleta)
            ->where('boletas_pagos.montoTotal', $montoTotal)
            ->where(function ($query) use ($nameParts) {
                foreach ($nameParts as $part) {
                    $part = strtolower($part);
                    $query->where(function ($q) use ($part) {
                        $q->whereRaw('LOWER(personas.apellido) LIKE ?', ["%{$part}%"])
                          ->orWhereRaw('LOWER(personas.nombre) LIKE ?', ["%{$part}%"]);
                    });
                }
            })
            ->select('boletas_pagos.estadoBoletaPago')
            ->first();

        if (!$boleta) {
            return response()->json(['exists' => false, 'paid' => false]);
        }

        $isPaid = $boleta->estadoBoletaPago == 1;

        return response()->json(['exists' => true, 'paid' => $isPaid]);
    }

    public function confirmarPago(Request $request)
    {
        $codigoBoleta = $request->input('codigoBoleta');
        $boleta = BoletaPago::where('codigoBoleta', $codigoBoleta)->first();

        if (!$boleta) {
            return response()->json(['message' => 'Boleta no encontrada.'], 404);
        }

        $boleta->estadoBoletaPago = 1;
        $boleta->fechaPago = now()->toDateString();
        $boleta->save();

        // Actualizar estadoInscripcion a 1 en la tabla inscripciones para las inscripciones con este codigoBoleta
        Inscripcion::where('codigoBoleta', $codigoBoleta)
            ->update(['estadoInscripcion' => 1]);

        return response()->json(['message' => 'Pago confirmado exitosamente.']);
    }
}
