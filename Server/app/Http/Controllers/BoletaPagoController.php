<?php

namespace App\Http\Controllers;

use App\Models\BoletaPago;
use App\Models\Inscripcion;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\MailController;

class BoletaPagoController extends Controller
{
    /**
     * @var MailController
     */
    protected $mailController;

    /**
     * Constructor
     * @param MailController $mailController
     */
    public function __construct(MailController $mailController)
    {
        $this->mailController = $mailController;
    }

    public function generarBoleta($idTutor, $codigoInscripcion)
    {
        Log::info('Datos recibidos del request', [$idTutor, $codigoInscripcion]);
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
                ->where('codigoInscripcion', $codigoInscripcion)
                ->get();

            if ($inscripciones->isEmpty()) {
                return response()->json(['message' => 'No hay inscripciones pendientes.'], 404);
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

            return $pdf->download("boleta_pago_{$boleta->codigoBoleta}.pdf");
        } catch (\Exception $e) {
            Log::error('Error al generar la boleta: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al generar la boleta.'], 500);
        }
    }

    public function generarPago(Request $request)
    {
        $numeroControlRaw = $request->input('numeroControl');
        if (!$numeroControlRaw || !preg_match('/(\d+)/', $numeroControlRaw, $matches)) {
        return response()->json(['exists' => false, 'paid' => false]);
        }
        $numeroControl = $matches[1];
        \Log::info('Checking numeroControl: ' . $numeroControl);

        if (!$numeroControl) {
            return response()->json(['exists' => false, 'paid' => false]);
        }

        $boleta = \DB::table('boletas_pagos')
            ->where('numeroControl', $numeroControl)
            ->select('estadoBoletaPago')
            ->first();

        if (!$boleta) {
            return response()->json(['exists' => false, 'paid' => false]);
        }

        $isPaid = $boleta->estadoBoletaPago == 0;

        return response()->json(['exists' => true, 'paid' => $isPaid]);
    }

    public function confirmarPago(Request $request)
    {
        $numeroControlRaw = $request->input('numeroControl');

        if (!$numeroControlRaw) {
            return response()->json(['message' => 'Número de control no proporcionado.'], 400);
        }

        // Normalizar: pasar a minúsculas y eliminar espacios, signos de puntuación y comillas
        $normalized = strtolower($numeroControlRaw);
        $normalized = preg_replace('/[\s\.\:\-\'\"]/', '', $normalized);

        // Buscar patrón "nro" seguido de caracteres no alfanuméricos, luego "control" seguido de caracteres no alfanuméricos y luego dígitos
        // Si no se encuentra el patrón, intentar extraer solo dígitos
        if (preg_match('/nro[^a-zA-Z0-9]*control[^a-zA-Z0-9]*[:\s\-+´\{\}\.<>\w]*?(\d+)/i', $normalized, $matches)) {
            $numeroControl = $matches[1];
        } elseif (preg_match('/(\d+)/', $normalized, $matches)) {
            $numeroControl = $matches[1];
        } else {
            return response()->json(['message' => 'Número de control inválido.'], 400);
        }

        $boleta = BoletaPago::where('numeroControl', $numeroControl)->first();

        if (!$boleta) {
            return response()->json(['message' => 'Boleta no encontrada.'], 404);
        }

        $boleta->estadoBoletaPago = 0;
        $boleta->fechaPago = now()->toDateString();
        $boleta->save();

        // Obtener el codigoBoleta de la boleta encontrada
        $codigoBoleta = $boleta->codigoBoleta;

        // Actualizar estadoInscripcion a 1 en la tabla inscripciones para las inscripciones con este codigoBoleta
        Inscripcion::where('codigoBoleta', $codigoBoleta)
            ->update(['estadoInscripcion' => 1]);

        // Send payment confirmation email to the tutor
        $tutor = Tutor::with('persona')->find($boleta->idTutor);
        if ($tutor && $tutor->persona) {
            $email = $tutor->persona->correoElectronico;
            if (!empty($email)) {
                $enviado = $this->mailController->enviarConfirmacionPago($boleta, $tutor);
                if (!$enviado) {
                    \Log::warning('No se pudo enviar el correo de confirmación al tutor.');
                }
            } else {
                \Log::warning('El tutor no tiene correo electrónico asignado.');
            }
        } else {
            \Log::warning('Tutor o persona no encontrado para la boleta: ' . $boleta->codigoBoleta);
        }

        return response()->json(['message' => 'Pago confirmado exitosamente.']);
    }

    public function getBoletasByTutor($tutorId)
    {
        if (!$tutorId) {
            return response()->json(['message' => 'Tutor ID no proporcionado.'], 400);
        }

        $boletas = BoletaPago::where('idTutor', $tutorId)->get();

        return response()->json(['boletas' => $boletas]);
    }

    public function reimprimirBoleta($codigoBoleta)
{
    try {
        $boleta = BoletaPago::where('codigoBoleta', $codigoBoleta)->first();

        if (!$boleta) {
            return response()->json(['message' => 'Boleta no encontrada.'], 404);
        }

        $tutor = Tutor::find($boleta->idTutor);
        $inscripciones = Inscripcion::with([
            'olimpista.persona',
            'OlimpiadaAreaCategoria.area'
        ])->where('codigoBoleta', $codigoBoleta)->get();

        if ($inscripciones->isEmpty()) {
            return response()->json(['message' => 'No hay inscripciones asociadas a esta boleta.'], 404);
        }

        $pdf = Pdf::loadView('boletas.plantillas', [
            'boleta' => $boleta,
            'tutor' => $tutor,
            'inscripciones' => $inscripciones,
            'fecha' => now()->toDateString(), // Cambia la fecha solo para mostrar
            'montoTotal' => $boleta->montoTotal,
        ]);

        return $pdf->download("boleta_pago_reimpresion_{$boleta->codigoBoleta}.pdf");

    } catch (\Exception $e) {
        Log::error('Error al reimprimir la boleta: ' . $e->getMessage());
        return response()->json(['message' => 'Error interno al reimprimir la boleta.'], 500);
    }
}

}
