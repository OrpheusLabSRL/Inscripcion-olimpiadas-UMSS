<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $usuario = Usuario::with(['rol.permisos'])->where('email', $request->email)->first();

    if (!$usuario || !Hash::check($request->password, $usuario->password)) {
        return response()->json([
            'message' => 'Credenciales incorrectas'
        ], 401);
    }

    return response()->json([
        'message' => 'Login exitoso',
        'usuario' => $usuario,
        'rol' => $usuario->rol->nombreRol,
        'permisos' => $usuario->rol->permisos->pluck('nombrePermiso')
    ]);
}

}
