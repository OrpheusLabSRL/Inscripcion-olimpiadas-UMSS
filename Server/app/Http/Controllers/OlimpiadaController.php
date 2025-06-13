<?php

namespace App\Http\Controllers;

use App\Services\OlimpiadaService;
use Illuminate\Http\Request;

class OlimpiadaController extends Controller
{
    protected $service;

    public function __construct(OlimpiadaService $service)
    {
        $this->service = $service;
    }

    public function mostrarOlimpiada()
    {
        $olimpiadas = $this->service->getAllOlimpiadas();
        return response()->json(['data' => $olimpiadas]);
    }

    public function mostrarOlimpiadasWithAreasCategorias()
    {
        $olimpiadas = $this->service->getAllOlimpiadasWithAreasCategorias();
        return response()->json(['data' => $olimpiadas]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreOlimpiada' => 'required|string|max:100',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimpiada' => 'required|date',
            'fechaFinOlimpiada' => 'required|date|after:fechaInicioOlimpiada',
        ]);

        $olimpiada = $this->service->createOlimpiada($validated);

        return response()->json([
            'message' => 'Olimpiada creada exitosamente',
            'data' => $olimpiada
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombreOlimpiada' => 'required|string|max:100,' . $id . ',idOlimpiada',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimpiada' => 'required|date',
            'fechaFinOlimpiada' => 'required|date|after:fechaInicioOlimpiada',
            'estadoOlimpiada' => 'required|boolean',
        ]);

        $olimpiada = $this->service->updateOlimpiada($id, $request->all());

        return response()->json([
            'message' => 'Olimpiada actualizada correctamente',
            'data' => $olimpiada
        ]);
    }

    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estadoOlimpiada' => 'required|boolean',
        ]);

        $olimpiada = $this->service->changeOlimpiadaStatus($id, $request->estadoOlimpiada);

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'data' => $olimpiada
        ]);
    }

    public function destroy($id)
    {
        $this->service->deleteOlimpiada($id);
        return response()->json([
            'message' => 'Olimpiada eliminada correctamente'
        ]);
    }
}