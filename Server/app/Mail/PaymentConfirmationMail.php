<?php

namespace App\Mail;

use App\Models\BoletaPago;
use App\Models\Tutor;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * La boleta de pago
     * @var BoletaPago
     */
    protected $boleta;

    /**
     * El tutor que realizó el pago
     * @var Tutor
     */
    protected $tutor;

    /**
     * Create a new message instance.
     * @param BoletaPago $boleta
     * @param Tutor $tutor
     * @return void
     */
    public function __construct(BoletaPago $boleta, Tutor $tutor)
    {
        $this->boleta = $boleta;
        $this->tutor = $tutor;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->subject('Confirmación de Pago de Boleta')
                    ->view('emails.payment_confirmation')
                    ->with([
                        'boleta' => $this->boleta,
                        'tutor' => $this->tutor,
                    ]);
    }
}
