<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class RolController extends Controller
{
    public function index(): JsonResponse
    {
        // Incluye los permisos asociados si los necesitas
        $roles = Rol::with('permisos')->get();

        return response()->json($roles);
    }

    public function store(Request $request)
{
    $request->validate([
        'nombreRol' => 'required|string|max:255|unique:roles,nombreRol',
        'descripcionRol' => 'nullable|string|max:500',
        'permisos' => 'array',
        'permisos.*' => 'exists:permisos,idPermiso'
    ]);

    $rol = Rol::create([
        'nombreRol' => $request->nombreRol,
        'descripcionRol' => $request->descripcionRol ?? '',
        'estadoRol' => true,
    ]);

    if ($request->has('permisos')) {
        $rol->permisos()->sync($request->permisos);
    }

    return response()->json([
        'message' => 'Rol creado exitosamente',
        'idRol' => $rol->idRol
    ], 201);
}

}

