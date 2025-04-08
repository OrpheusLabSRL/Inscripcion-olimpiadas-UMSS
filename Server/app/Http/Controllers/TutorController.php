<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tutor;
use App\Models\Olimpista;

class TutorController extends Controller
{

    public function getEstudiantes($id_tutor)
    {
        // Verificar si el tutor existe
        $tutor = Tutor::find($id_tutor);

        if (!$tutor) {
            return response()->json(['error' => 'Tutor no encontrado'], 404);
        }


        $estudiantes = $tutor->olimpistas; 

        // Devolver los estudiantes en formato JSON
        return response()->json($estudiantes);
    }
}
