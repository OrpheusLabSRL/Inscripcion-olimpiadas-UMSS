<?php

namespace App\Http\Controllers;

use App\Models\Olimpista;
use App\Models\Persona;
use App\Models\Tutor;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class PersonaController extends Controller
{
    public function getPersonData(Request $request)
{
    $persona = Persona::where("carnetIdentidad", $request->carnet_identidad)->first();
    $idOlimpiada = $request->id_olimpiada;
    if (!$persona) {
        return response()->json([
            'success' => false,
            'message' => 'No se encontraron datos asociados a este carnet de identidad',
        ], 404);
    }

    $olimpista = Olimpista::where("idPersona", $persona->idPersona)->first();
    $tutor = Tutor::where("idPersona", $persona->idPersona)->first();

    $inscripcionOlimpista = $olimpista
        ? Inscripcion::where('idOlimpista', $olimpista->idPersona)
            ->whereHas('OlimpiadaAreaCategoria', function ($q) use ($idOlimpiada) {
                $q->where('idOlimpiada', $idOlimpiada);
            })->exists()
        : false;


    $tutorEnInscripcion = $tutor
        ? Inscripcion::where(function ($query) use ($tutor) {
                $query->where('idTutorResponsable', $tutor->idPersona)
                      ->orWhere('idTutorLegal', $tutor->idPersona)
                      ->orWhere('idTutorArea', $tutor->idPersona);
            })
            ->whereHas('OlimpiadaAreaCategoria', function ($q) use ($idOlimpiada) {
                $q->where('idOlimpiada', $idOlimpiada);
            })->exists()
        : false;
    
    // Log::info('Persona encontrada:', [$tutorEnInscripcion, 'idOlimpiada' => $idOlimpiada]);

    if (!$inscripcionOlimpista && !$tutorEnInscripcion) {
        return response()->json([
            'success' => true,
            'message' => 'La persona no participa en esta olimpiada',
            'data' => []
        ]);
    }

    return response()->json([
        'success' => true,
        'message' => 'Datos autocompletados correctamente',
        'data' => [
            'nombre' => $persona->nombre,
            'apellido' => $persona->apellido,
            'carnetIdentidad' => $persona->carnetIdentidad,
            'correoElectronico' => $persona->correoElectronico,
            'departamento' => $olimpista?->departamento,
            'municipio' => $olimpista?->municipio,
            'fechaNacimiento' => $olimpista?->fechaNacimiento,
            'curso' => $olimpista?->curso,
            'colegio' => $olimpista?->colegio,
            'tipoTutor' => $tutor?->tipoTutor,
            'telefono' => $tutor?->telefono,
            'esTutorResponsable' => $tutor 
                ? Inscripcion::where('idTutorResponsable', $tutor->idPersona)->exists()
                : false
        ]
    ]);
}

}
    
