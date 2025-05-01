<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactoMail;
use Illuminate\Support\Facades\Log;
use Swift_TransportException;

class ContactoController extends Controller
{
    public function enviarContacto(Request $request)
    {
        try {
            Log::info('=== INICIO DE ENVÍO DE CORREO ===');
            Log::info('Datos recibidos:', $request->all());

            $request->validate([
                'nombre' => 'required|string',
                'correo' => 'required|email',
                'numero' => 'required|string',
                'motivo' => 'required|string',
                'descripcion' => 'required|string'
            ]);

            $datos = [
                'nombre' => $request->nombre,
                'correo' => $request->correo,
                'numero' => $request->numero,
                'motivo' => $request->motivo,
                'descripcion' => $request->descripcion
            ];

            Log::info('Datos validados y preparados:', $datos);

            // Verificar la configuración actual de correo
            Log::info('Configuración de correo actual:', [
                'driver' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'username' => config('mail.mailers.smtp.username'),
                'encryption' => config('mail.mailers.smtp.encryption'),
                'from_address' => config('mail.from.address'),
                'from_name' => config('mail.from.name')
            ]);

            // Intentar enviar el correo
            Log::info('Iniciando envío de correo...');
            
            try {
                Mail::to('201904903@est.umss.edu.bo')->send(new ContactoMail($datos));
                Log::info('Correo enviado exitosamente');
            } catch (Swift_TransportException $e) {
                Log::error('Error de transporte SMTP:', [
                    'error' => $e->getMessage(),
                    'code' => $e->getCode(),
                    'previous' => $e->getPrevious() ? $e->getPrevious()->getMessage() : null
                ]);
                throw $e;
            }

            return response()->json([
                'success' => true,
                'message' => 'Correo enviado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'type' => get_class($e)
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el correo: ' . $e->getMessage(),
                'error_details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'type' => get_class($e)
                ]
            ], 500);
        }
    }
} 