<?php

namespace App\Http\Controllers;

use App\Models\Permiso;
use Illuminate\Http\JsonResponse;

class PermisoController extends Controller
{
    public function index(): JsonResponse
    {
        $permisos = Permiso::where('estadoPermiso', true)->get();

        return response()->json($permisos);
    }
}

