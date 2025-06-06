<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\MailController;

class ContactoController extends Controller
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

    /**
     * Maneja el envío del formulario de contacto
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function enviarContacto(Request $request)
    {
        return $this->mailController->enviarCorreoContacto($request);
    }
} 