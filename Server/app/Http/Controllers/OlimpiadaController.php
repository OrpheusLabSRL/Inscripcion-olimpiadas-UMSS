<?php

namespace App\Http\Controllers;

use App\Models\Olimpiada;
use App\Models\OlimpiadaAreaCategoria;
use App\Models\Area;
use Illuminate\Http\Request;

class OlimpiadaController extends Controller
{
    // API - Listar todas las olimpiadas
    public function mostrarOlimpiada()
    {
        $olimpiadas = Olimpiada::all();
        return response()->json(['data' => $olimpiadas]);
    }

    // Vista Blade para mostrar formulario con olimpiadas (puedes ampliarla si deseas mostrar áreas)
    public function formularioOlimpiada()
    {
        $olimpiadas = Olimpiada::with('combinaciones.area')->get();
        return view('welcome', compact('olimpiadas'));
    }

    // Guardar nueva olimpiada desde Blade
    public function agregarOlimpiada(Request $request)
    {
        $request->validate([
            'nombreOlimpiada' => 'required|string|max:30|unique:olimpiada,nombreOlimpiada',
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

    // API - Crear nueva olimpiada
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreOlimpiada' => 'required|string|max:100|unique:olimpiada,nombreOlimpiada',
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

    // API - Actualizar olimpiada
    public function update(Request $request, $id)
    {
        $olimpiada = Olimpiada::findOrFail($id);

        $request->validate([
            'nombreOlimpiada' => 'required|string|max:100|unique:olimpiada,nombreOlimpiada,' . $id . ',idOlimpiada',
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

    // API - Eliminar olimpiada
    public function destroy($id)
    {
        $olimpiada = Olimpiada::findOrFail($id);
        $olimpiada->delete();

        return response()->json([
            'message' => 'Olimpiada eliminada correctamente'
        ]);
    }

    // NUEVO: Asignar combinaciones de área y categoría a una olimpiada
    public function asignarAreasYCategorias(Request $request)
    {
        $data = $request->all();

        foreach ($data as $item) {
            $validator = \Validator::make($item, [
                'idOlimpiada' => 'required|exists:olimpiada,idOlimpiada',
                'idArea' => 'required|exists:area,idArea',
                'idCategoria' => 'required|exists:categoria,idCategoria',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $validator->errors(),
                ], 422);
            }

            OlimpiadaAreaCategoria::firstOrCreate(
                [
                    'idOlimpiada' => $item['idOlimpiada'],
                    'idArea' => $item['idArea'],
                    'idCategoria' => $item['idCategoria'],
                ],
                [
                    'estado' => true,
                ]
            );
        }

        return response()->json([
            'message' => 'Combinaciones registradas con éxito',
        ], 201);
    }

    // NUEVO: Obtener áreas y categorías asignadas a una olimpiada
    public function obtenerAreasYCategorias($id)
    {
        $combinaciones = OlimpiadaAreaCategoria::where('idOlimpiada', $id)
            ->with(['area', 'categoria'])
            ->get()
            ->groupBy('idArea');

        $resultados = [];

        foreach ($combinaciones as $idArea => $grupo) {
            $area = $grupo->first()->area;
            $categorias = $grupo->pluck('categoria')->map(function ($cat) {
                return [
                    'idCategoria' => $cat->idCategoria,
                    'nombreCategoria' => $cat->nombreCategoria
                ];
            });

            $resultados[] = [
                'idArea' => $area->idArea,
                'nombreArea' => $area->nombreArea,
                'categorias' => $categorias,
            ];
        }

        return response()->json($resultados);
    }
}
