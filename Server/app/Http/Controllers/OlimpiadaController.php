<?php

namespace App\Http\Controllers;

use App\Models\Olimpiada;
use Illuminate\Http\Request;

class OlimpiadaController extends Controller
{
    // API - Listar todas las olimpiadas en JSON
    public function mostrarOlimpiada()
    {
        $olimpiadas = Olimpiada::all();
        return response()->json(['data' => $olimpiadas]);
    }

    // Vista tradicional Blade (formulario con olimpiadas y sus áreas)
    public function formularioOlimpiada()
    {
        $olimpiadas = Olimpiada::with('areas')->get();
        return view('welcome', compact('olimpiadas'));
    }

    // Guardar nueva olimpiada desde formulario Blade
    public function agregarOlimpiada(Request $request)
    {
        $request->validate([
            'nombreOlimpiada' => 'required|string|max:30|unique:olimpiadas,nombreOlimpiada',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimp' => 'required|date',
            'fechaFinOlimp' => 'required|date|after:fechaInicioOlimp',
        ]);

        Olimpiada::create([
            'nombreOlimpiada' => $request->nombreOlimpiada,
            'version' => $request->version,
            'fechaInicioOlimp' => $request->fechaInicioOlimp,
            'fechaFinOlimp' => $request->fechaFinOlimp,
            'estadoOlimpiada' => 1,
        ]);

        return redirect()->route('olimpiada.mostrar')->with('success', 'Olimpiada creada con éxito');
    }

    // API - Guardar nueva olimpiada desde JSON
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreOlimpiada' => 'required|string|max:100|unique:olimpiadas,nombreOlimpiada',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimp' => 'required|date',
            'fechaFinOlimp' => 'required|date|after:fechaInicioOlimp',
        ]);

        $validated['estadoOlimpiada'] = 1;

        $olimpiada = Olimpiada::create($validated);

        return response()->json([
            'message' => 'Olimpiada creada exitosamente',
            'data' => $olimpiada
        ], 201);
    }

    // API - Actualizar una olimpiada
    public function update(Request $request, $id)
    {
        $olimpiada = Olimpiada::findOrFail($id);

        $request->validate([
            'nombreOlimpiada' => 'required|string|max:100|unique:olimpiadas,nombreOlimpiada,' . $id . ',idOlimpiada',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimp' => 'required|date',
            'fechaFinOlimp' => 'required|date|after:fechaInicioOlimp',
            'estadoOlimpiada' => 'required|boolean',
        ]);

        $olimpiada->update($request->all());

        return response()->json([
            'message' => 'Olimpiada actualizada correctamente',
            'data' => $olimpiada
        ]);
    }

    // API - Eliminar una olimpiada
    public function destroy($id)
    {
        $olimpiada = Olimpiada::findOrFail($id);
        $olimpiada->delete();

        return response()->json([
            'message' => 'Olimpiada eliminada correctamente'
        ]);
    }

    public function asignarAreasYCategorias(Request $request)
    {
        $validated = $request->validate([
            'idOlimpiada' => 'required|exists:olimpiada,idOlimpiada',
            'areas' => 'required|array',
            'areas.*.idArea' => 'required|exists:area,idArea',
            'areas.*.categorias' => 'required|array',
            'areas.*.categorias.*' => 'required|exists:categoria,idCategoria',
        ]);

        foreach ($validated['areas'] as $area) {
            // Insertar en olimpiada_area (tabla intermedia)
            \App\Models\OlimpiadaArea::firstOrCreate(
                [
                    'idOlimpiada' => $validated['idOlimpiada'],
                    'idArea' => $area['idArea'],
                ],
                [
                    'estadoOlimpArea' => 1,
                ]
            );

            // Insertar en area_categoria (tabla intermedia)
            foreach ($area['categorias'] as $categoriaId) {
                \App\Models\AreaCategoria::firstOrCreate(
                    [
                        'idArea' => $area['idArea'],
                        'idCategoria' => $categoriaId,
                    ],
                    [
                        'estadoAreaCategoria' => 1,
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Asignación realizada con éxito',
        ]);
    }

}
