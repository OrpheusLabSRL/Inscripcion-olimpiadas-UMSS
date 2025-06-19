<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ContactoService;

class ContactoController extends Controller
{
    /**
     * @var ContactoService
     */
    protected $contactoService;

    /**
     * Constructor
     * @param ContactoService $contactoService
     */
    public function __construct(ContactoService $contactoService)
    {
        $this->contactoService = $contactoService;
    }

    /**
     * Maneja el envío del formulario de contacto
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function enviarContacto(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'correo' => 'required|email',
            'numero' => 'required|string',
            'motivo' => 'required|string',
            'descripcion' => 'required|string'
        ]);

        $datos = $request->only(['nombre', 'correo', 'numero', 'motivo', 'descripcion']);
        $exito = $this->contactoService->enviarMensaje($datos);

        if ($exito) {
            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje'
            ], 500);
        }
    }
} 