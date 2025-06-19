<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactoMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Los datos del formulario de contacto
     * @var array
     */
    protected $datos;

    /**
     * Create a new message instance.
     * @param array $datos
     * @return void
     */
    public function __construct(array $datos)
    {
        $this->datos = $datos;
    }

    /**
     * Build the message.
     * @return $this
     */
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