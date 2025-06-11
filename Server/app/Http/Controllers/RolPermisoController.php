<?php

namespace App\Http\Controllers;

use App\Models\RolPermiso;
use Illuminate\Http\Request;

class RolPermisoController extends Controller
{
    // Mostrar todos los roles permisos
    public function index()
    {
        $rolesPermisos = RolPermiso::with(['rol', 'permiso'])->get();
        return response()->json($rolesPermisos);
    }

    // Crear un nuevo rol permiso
    public function store(Request $request)
    {
        $validated = $request->validate([
            'idRol' => 'required|exists:roles,idRol',
            'idPermiso' => 'required|exists:permisos,idPermiso',
            'estadoRolPermiso' => 'boolean',
        ]);

        $rolPermiso = RolPermiso::create($validated);

        return response()->json($rolPermiso, 201);
    }

    // Mostrar un rol permiso específico
    public function show($id)
    {
        $rolPermiso = RolPermiso::with(['rol', 'permiso'])->findOrFail($id);
        return response()->json($rolPermiso);
    }

    // Actualizar un rol permiso
    public function update(Request $request, $id)
    {
        $rolPermiso = RolPermiso::findOrFail($id);

        $validated = $request->validate([
            'idRol' => 'exists:roles,idRol',
            'idPermiso' => 'exists:permisos,idPermiso',
            'estadoRolPermiso' => 'boolean',
        ]);

        $rolPermiso->update($validated);

        return response()->json($rolPermiso);
    }

    // Eliminar un rol permiso
    public function destroy($id)
    {
        $rolPermiso = RolPermiso::findOrFail($id);
        $rolPermiso->delete();

        return response()->json(null, 204);
    }
}
