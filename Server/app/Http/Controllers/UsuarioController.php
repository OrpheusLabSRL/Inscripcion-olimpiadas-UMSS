<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;


class UsuarioController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:50',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|string|min:6',
        'idRol' => 'required|exists:roles,idRol'
    ]);

    $usuario = Usuario::create([
        'nombre' => $request->nombre,
        'nombreUsuario' => $request->nombre,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'idRol' => $request->idRol,
        'estadoUsuario' => true
    ]);

    return response()->json([
        'message' => 'Usuario creado exitosamente',
        'usuario' => $usuario
    ], 201);
}
}
