<?php

namespace App\Http\Controllers;
use App\Models\Olimpiada;

use Illuminate\Http\Request;
use Nette\Utils\Json;
use Symfony\Contracts\Service\Attribute\Required;

class OlimpiadaController extends Controller
{
    public function mostrarOlimpiada()
    {
        $olimpiadas = Olimpiada::all();
        return response()->json(['data' => $olimpiadas]);
        // return view ('welcome',compact('olimpiadas'));
    }

    public function formularioOlimpiada()
    {
        $olimpiadas = Olimpiada::with('areas')->get();
        return view ('welcome',compact('olimpiadas'));
    }

    public function agregarOlimpiada(Request $request){
        $request->validate([
            'nombreOlimpiada'=> 'required|string|max:30|unique:olimpiadas,nombreOlimpiada',
            'version'=> 'required|integer|min:1',
            'fechaInicioOlimp'=> 'required|date',
            'fechaFinOlimp'=> 'required|date|after:fechaInicioOlimp'
        ]);

        Olimpiada::create($request->all());
        return redirect()->route('olimpiada.mostrar')->with('success', 'Olimpiada creada con éxito');
    }
}
