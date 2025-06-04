<?php

namespace App\Http\Controllers;

use App\Models\Olimpista;
use App\Models\Persona;
use App\Models\Tutor;
use App\Models\Inscripcion;

class PersonaController extends Controller
{
    public function getPersonData($carnet_identidad)
{
    $persona = Persona::where("carnetIdentidad", $carnet_identidad)->first();

    if ($persona) {
        $olimpista = Olimpista::where("idPersona", $persona->idPersona)->first();
        $tutor = Tutor::where("idPersona", $persona->idPersona)->first();

        // Verifica solo si es tutor responsable en alguna inscripción
        $esTutorResponsable = Inscripcion::where('idTutorResponsable', $persona->idPersona)->exists();

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
                'esTutorResponsable' => $esTutorResponsable
            ]
        ]);
    } else {
        return response()->json([
            'success' => false,
            'message' => 'No se encontraron datos asociados a este carnet de identidad',
        ], 404);
    }
}
}
    
