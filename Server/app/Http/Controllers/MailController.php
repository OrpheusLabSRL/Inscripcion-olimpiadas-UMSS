<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactoMail;
use App\Mail\PaymentConfirmationMail;
use App\Models\BoletaPago;
use App\Models\Tutor;
use Illuminate\Support\Facades\Log;
use Swift_TransportException;

class MailController extends Controller
{
    public function enviarCorreoContacto(Request $request)
    {
        try {
            Log::info('=== INICIO DE ENVÍO DE CORREO DE CONTACTO ===');
            Log::info('Datos recibidos:', $request->all());

            $request->validate([
                'nombre' => 'required|string',
                'correo' => 'required|email',
                'numero' => 'required|string',
                'motivo' => 'required|string',
                'descripcion' => 'required|string'
            ]);

            $datos = $request->only(['nombre', 'correo', 'numero', 'motivo', 'descripcion']);

            Mail::to(config('mail.admin_address', 'orpheuslab011@gmail.com'))
                ->send(new ContactoMail($datos));

            Log::info('Correo de contacto enviado exitosamente');

            return response()->json([
                'success' => true,
                'message' => 'Correo enviado exitosamente'
            ]);

        } catch (Swift_TransportException $e) {
            Log::error('Error de transporte SMTP:', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
                'previous' => $e->getPrevious() ? $e->getPrevious()->getMessage() : null
            ]);
            return $this->handleMailError($e);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de contacto:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->handleMailError($e);
        }
    }

    /**
     * Envía un correo de confirmación de pago
     * @param BoletaPago $boleta
     * @param Tutor $tutor
     * @return bool
     */
    public function enviarConfirmacionPago(BoletaPago $boleta, Tutor $tutor)
    {
        try {
            if (!$tutor->persona || !$tutor->persona->correoElectronico) {
                Log::warning('No se puede enviar correo de confirmación: Tutor sin correo electrónico', [
                    'tutor_id' => $tutor->idPersona
                ]);
                return false;
            }

            Mail::to($tutor->persona->correoElectronico)
                ->send(new PaymentConfirmationMail($boleta, $tutor));

            Log::info('Correo de confirmación de pago enviado exitosamente', [
                'tutor_email' => $tutor->persona->correoElectronico,
                'boleta_id' => $boleta->codigoBoleta
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('Error al enviar correo de confirmación de pago:', [
                'error' => $e->getMessage(),
                'tutor_id' => $tutor->idPersona,
                'boleta_id' => $boleta->codigoBoleta
            ]);
            return false;
        }
    }

    /**
     * Maneja los errores de envío de correo de manera consistente
     * @param \Exception $e
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleMailError(\Exception $e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Error al enviar el correo',
            'error_details' => [
                'message' => $e->getMessage(),
                'type' => get_class($e)
            ]
        ], 500);
    }
}
