<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Olimpiada;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    public function mostrarArea(){
        $area = Area::all();
        $olimpiada = Olimpiada::all();
        return view ('area', compact('area','olimpiada'));
    }

    public function agregarArea(Request $request){
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
}
