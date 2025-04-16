<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OlimpiadaAreaCategoria;

class OlimpiadaAreaCategoriaController extends Controller
{
    public function index()
    {
        return OlimpiadaAreaCategoria::with(['olimpiada', 'area', 'categoria'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'idOlimpiada' => 'required|exists:olimpiada,idOlimpiada',
            'idArea' => 'required|exists:area,idArea',
            'idCategoria' => 'required|exists:categoria,idCategoria',
        ]);

        return OlimpiadaAreaCategoria::create($request->all());
    }

    public function destroy($id)
    {
        $item = OlimpiadaAreaCategoria::findOrFail($id);
        $item->delete();

        return response()->json(['mensaje' => 'Combinación eliminada']);
    }

    public function porOlimpiada($idOlimpiada)
    {
        $combinaciones = \App\Models\OlimpiadaAreaCategoria::with(['area', 'categoria'])
            ->where('idOlimpiada', $idOlimpiada)
            ->get();

        return response()->json($combinaciones);
    }
}
