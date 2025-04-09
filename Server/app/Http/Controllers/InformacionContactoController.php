<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InformacionContacto;

class InformacionContactoController extends Controller
{
    public function store(Request $request)
    {
        // $request->validate([
        //     'correo_contacto' => 'required|email|max:50',
        //     'pertenece_correo' => 'required|string|max:20',
        //     'numero_contacto' => 'required|integer',
        //     'pertenece_numero' => 'required|string|max:20',
        //     'id_olimpista' => 'required|exists:olimpistas,id_olimpista|unique:informacion_contactos,id_olimpista',
        // ]);

        $contacto = InformacionContacto::create($request->only([
            'correo_contacto',
            'pertenece_correo',
            'numero_contacto',
            'pertenece_numero',
            'id_olimpista'
        ]));

        return response()->json([
            'message' => 'Información de contacto registrada correctamente',
            'data' => $contacto
        ], 201);
    }
}
