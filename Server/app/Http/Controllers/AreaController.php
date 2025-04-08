<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Olimpiada;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    // ✅ API: Obtener todas las áreas en formato JSON
    public function index()
    {
        return response()->json(Area::all(), 200);
    }

    // Vista tradicional Blade
    public function mostrarArea()
    {
        $area = Area::all();
        $olimpiada = Olimpiada::all();
        return view('area', compact('area', 'olimpiada'));
    }

    // Guardar área desde formulario tradicional
    public function agregarArea(Request $request)
    {
        $request->validate([
            'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada',
            'nombreArea' => 'required|string|max:30|unique:areas,nombreArea',
            'descripcionArea' => 'nullable|string|max:300',
            'costoArea' => 'required|integer|min:1',
            'estadoArea' => 'sometimes|boolean'
        ]);

        Area::create($request->all());

        return redirect()->route('area.mostrar')->with('success', 'Área creada con éxito');
    }
    public function store(Request $request)
    {
        $request->validate([
            'nombreArea' => 'required|string',
            'descripcionArea' => 'nullable|string',
            'costoArea' => 'required|numeric',
            'estadoArea' => 'required|boolean',
            'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada'
        ]);

        Area::create($request->all());

        return response()->json(['message' => 'Área registrada correctamente']);
    }

}
