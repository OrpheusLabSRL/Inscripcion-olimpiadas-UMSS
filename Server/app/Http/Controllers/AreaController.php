<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    // API: Obtener todas las áreas
    public function index()
    {
        return response()->json(Area::all(), 200);
    }

    // Guardar área vía API
    public function store(Request $request)
    {
        $request->validate([
            'nombreArea' => 'required|string',
            'descripcionArea' => 'nullable|string',
        ]);

        Area::create($request->only(['nombreArea', 'descripcionArea']));

        return response()->json(['message' => 'Área registrada correctamente']);
    }

    // Obtener estructura del programa (área + categoría + grados + costo)
    public function getProgramaCompleto()
    {
        $programa = [];

        $areas = Area::with(['categorias' => function ($query) {
            $query->where('estadoCategoria', true)
                ->with(['grados' => function ($q) {
                    $q->where('estadoGrado', true);
                }]);
        }])->get();

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
}
