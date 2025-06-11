<?php

namespace App\Services;

use App\Models\BoletaPago;
use App\Models\Inscripcion;
use App\Models\Tutor;
use Illuminate\Support\Facades\Log;

class ConfirmarPagoService
{
    public function confirmarPago($numeroControlRaw, $mailController)
    {
        if (!$numeroControlRaw) {
            throw new \Exception('Número de control no proporcionado.');
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
            throw new \Exception('Número de control inválido.');
        }

        $boleta = BoletaPago::where('numeroControl', $numeroControl)->first();

        if (!$boleta) {
            throw new \Exception('Boleta no encontrada.');
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
                $enviado = $mailController->enviarConfirmacionPago($boleta, $tutor);
                if (!$enviado) {
                    Log::warning('No se pudo enviar el correo de confirmación al tutor.');
                }
            } else {
                Log::warning('El tutor no tiene correo electrónico asignado.');
            }
        } else {
            Log::warning('Tutor o persona no encontrado para la boleta: ' . $boleta->codigoBoleta);
        }

        return 'Pago confirmado exitosamente.';
    }
}
