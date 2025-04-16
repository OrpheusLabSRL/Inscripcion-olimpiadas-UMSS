<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Olimpiada;
use App\Models\OlimpiadaAreaCategoria;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    // API: Obtener todas las áreas
    public function index()
    {
        return response()->json(Area::all(), 200);
    }

    // Vista Blade: Mostrar áreas
    public function mostrarArea()
    {
        $area = Area::all();
        $olimpiada = Olimpiada::all();
        return view('area', compact('area', 'olimpiada'));
    }

    // Guardar área desde formulario Blade
    public function agregarArea(Request $request)
    {
        $request->validate([
            'nombreArea' => 'required|string|max:30|unique:area,nombreArea',
            'descripcionArea' => 'nullable|string|max:300',
            'costoArea' => 'required|integer|min:1',
            'estadoArea' => 'sometimes|boolean'
        ]);

        Area::create($request->all());

        return redirect()->route('area.mostrar')->with('success', 'Área creada con éxito');
    }

    // Guardar área vía API
    public function store(Request $request)
    {
        $request->validate([
            'nombreArea' => 'required|string',
            'descripcionArea' => 'nullable|string',
            'costoArea' => 'required|numeric',
            'estadoArea' => 'required|boolean'
        ]);

        Area::create($request->all());

        return response()->json(['message' => 'Área registrada correctamente']);
    }

    // Obtener estructura completa del programa (área + categoría + grados) desde la nueva tabla pivote
    public function getProgramaCompleto()
    {
        $programa = [];

        $combinaciones = OlimpiadaAreaCategoria::with([
            'area' => function ($q) {
                $q->where('estadoArea', true);
            },
            'categoria' => function ($q) {
                $q->where('estadoCategoria', true)
                    ->with(['grados' => function ($g) {
                        $g->where('estadoGrado', true);
                    }]);
            }
        ])->get();

        foreach ($combinaciones as $combo) {
            $area = $combo->area;
            $categoria = $combo->categoria;
            $grados = $categoria->grados ?? collect();

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
                    'olimpiada_id' => $combo->idOlimpiada,
                ];
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
