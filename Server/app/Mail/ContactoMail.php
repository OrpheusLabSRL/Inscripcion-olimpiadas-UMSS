<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $datos;

    public function __construct($datos)
    {
        $this->datos = $datos;
    }

    public function build()
    {
        return $this->subject($this->datos['motivo'])
                    ->view('emails.contacto')
                    ->with([
                        'nombre' => $this->datos['nombre'],
                        'correo' => $this->datos['correo'],
                        'numero' => $this->datos['numero'],
                        'descripcion' => $this->datos['descripcion']
                    ]);
    }
} 