<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\ContactoRepositoryInterface;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactoMail;

class ContactoRepository implements ContactoRepositoryInterface
{
    public function enviarMensaje(array $datos): bool
    {
        try {
            // Enviar correo
            Mail::to(config('mail.admin_address', 'orpheuslab011@gmail.com'))
                ->send(new ContactoMail($datos));
            // Aquí podrías guardar en base de datos si lo deseas
            return true;
        } catch (\Exception $e) {
            \Log::error('Error al enviar mensaje de contacto: ' . $e->getMessage());
            return false;
        }
    }
} 