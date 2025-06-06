<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    // API: Obtener todas las áreas (solo activas por defecto)
    public function index(Request $request)
    {
        // Permitir filtrar por estadoArea (true, false o todos)
        $estado = $request->query('estadoArea');

        $query = Area::query();

        if ($estado !== null) {
            // Convertir a booleano si es 'true' o 'false' string
            if ($estado === 'true' || $estado === '1') {
                $query->where('estadoArea', true);
            } elseif ($estado === 'false' || $estado === '0') {
                $query->where('estadoArea', false);
            }
            // Si no es ninguno, no filtra
        } else {
            // Por defecto mostrar solo activas
            $query->where('estadoArea', true);
        }

        $areas = $query->get();

        return response()->json($areas, 200);
    }

    // Guardar área vía API
    public function store(Request $request)
    {
        $request->validate([
            'nombreArea' => 'required|string',
            'descripcionArea' => 'nullable|string',
            'estadoArea' => 'sometimes|boolean', // nuevo campo estadoArea opcional
        ]);

        $data = $request->only(['nombreArea', 'descripcionArea']);
        if ($request->has('estadoArea')) {
            $data['estadoArea'] = $request->boolean('estadoArea');
        } else {
            $data['estadoArea'] = true;
        }

        Area::create($data);

        return response()->json(['message' => 'Área registrada correctamente']);
    }

    // Obtener estructura del programa (área + categoría + grados + costo)
    public function getProgramaCompleto($id)
    {
        // Solo áreas activas
        $idOlimpiada = $id  ; // el idOlimpiada que quieras filtrar

        $areas = Area::where('estadoArea', true)
                ->whereHas('categorias', function ($query) use ($idOlimpiada) {
                    $query->where('estadoCategoria', true)
                        ->where('olimpiadas_areas_categorias.idOlimpiada', $idOlimpiada)
                        ->where('olimpiadas_areas_categorias.estado', true);
                })
                ->with(['categorias' => function ($query) use ($idOlimpiada) {
                    $query->where('estadoCategoria', true)
                        ->where('olimpiadas_areas_categorias.idOlimpiada', $idOlimpiada)
                        ->where('olimpiadas_areas_categorias.estado', true)
                        ->with(['grados' => function ($q) {
                            $q->where('estadoGrado', true);
                        }]);
                }])
                ->get();


        $programa = [];

        foreach ($areas as $area) {
            foreach ($area->categorias as $categoria) {
                $grados = $categoria->grados;

                if ($grados->count() > 0) {
                    $gradosOrdenados = $grados->sortBy('numeroGrado')->values();
                    $primero = $gradosOrdenados->first();
                    $ultimo = $gradosOrdenados->last();
                    $mismoNivel = $gradosOrdenados->every(fn($g) => $g->nivel === $primero->nivel);

                    if ($gradosOrdenados->count() === 1) {
                        $gradoFormateado = $this->formatearGrado($primero->numeroGrado, $primero->nivel);
                    } elseif ($mismoNivel) {
                        $gradoFormateado = "{$primero->numeroGrado}° a {$ultimo->numeroGrado}° {$primero->nivel}";
                    } else {
                        $gradoFormateado = $gradosOrdenados->map(function ($g) {
                            return $this->formatearGrado($g->numeroGrado, $g->nivel);
                        })->implode(' / ');
                    }

                    $programa[] = [
                        'area' => $area->nombreArea,
                        'nivel' => $categoria->nombreCategoria,
                        'grados' => $gradoFormateado,
                        'area_id' => $area->idArea,
                        'categoria_id' => $categoria->idCategoria,
                        'costo' => $categoria->pivot->costo,
                    ];
                }
            }
        }

        return response()->json($programa);
    }

    // Formato visual del grado
    private function formatearGrado($numero, $nivel)
    {
        $simbolo = is_numeric($numero) ? "{$numero}°" : $numero;
        return "{$simbolo} {$nivel}";
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombreArea' => 'required|string',
            'descripcionArea' => 'nullable|string',
        ]);

        $area = Area::findOrFail($id);
        $area->update($request->only(['nombreArea', 'descripcionArea']));

        return response()->json(['message' => 'Área actualizada correctamente']);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            'estadoArea' => 'required|boolean',
        ]);

        $area = Area::findOrFail($id);
        $area->estadoArea = $request->estadoArea;
        $area->save();

        return response()->json(['message' => 'Estado del área actualizado correctamente']);
    }

    public function destroy($id)
    {
        $area = Area::findOrFail($id);
        $area->delete();

        return response()->json(['message' => 'Área eliminada correctamente']);
    }

}
