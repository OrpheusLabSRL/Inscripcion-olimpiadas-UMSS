<?php

namespace App\Http\Controllers;


use App\Models\Inscripcion;
use Illuminate\Http\Request;
use App\Models\Olimpista;
use Illuminate\Support\Facades\Log;

class OlimpistaController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    Log::info('Datos del Request:', $request->all());

    $olimpista = Olimpista::create([
        'correo' => $request->Email,
        'apellido' => $request->Apellido,
        'Nombre' => $request->Nombre,
        'carnetIdentidad' => $request->CarnetIdentidad,
        'curso' => $request->Curso,
        'fechaNacimiento' => $request->FechaNacimiento,
        'colegio' => $request->Colegio,
        'departamento' => $request->Departamento,
        'provincia' => $request->Provincia,
    ]);
    
    $olimpista->tutores()->attach($request->id_tutor);

    return response()->json([
        'message' => 'Olimpista creado exitosamente',
        'data' => $olimpista
    ], 201);
}

public function getOlimpistasByTutor($idTutorResponsable)
{
    try {
        $inscripciones = Inscripcion::with([
            'olimpista.persona',
            'tutorArea.persona',
            'olimpiadaAreaCategoria.area',
            'olimpiadaAreaCategoria.categoria'
        ])
        ->where('idTutorResponsable', $idTutorResponsable)
        ->get();

        if ($inscripciones->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No se encontraron olimpistas para este tutor',
                'data' => []
            ], 200);
        }

        $olimpistasAgrupados = $inscripciones->groupBy('idOlimpista');

        $resultado = $olimpistasAgrupados->map(function ($inscripcionesGrupo) {
            $primeraInscripcion = $inscripcionesGrupo->first();
            $olimpista = $primeraInscripcion->olimpista;
            $persona = $olimpista->persona;

            $areas = $inscripcionesGrupo->map(function ($inscripcion) {
                return [
                    'id_inscripcion' => $inscripcion->idInscripcion,
                    'nombre_area' => $inscripcion->olimpiadaAreaCategoria->area->nombreArea ?? null,
                    'nombre_categoria' => $inscripcion->olimpiadaAreaCategoria->categoria->nombreCategoria ?? null,
                    'nombre_tutor_area' => $inscripcion->tutorArea->persona->nombre ?? null,
                    'apellido_tutor_area' => $inscripcion->tutorArea->persona->apellido ?? null,
                    'telefono' => $inscripcion->tutorArea->telefono ?? null,
                    'tipo_tutor' => $inscripcion->tutorArea->tipoTutor ?? null,
                    'carnetIdentidad' => $inscripcion->tutorArea->persona->carnetIdentidad ?? null,
                    'correo' => $inscripcion->tutorArea->persona->correoElectronico ?? null,
                ];
            });

            return [
                'id_olimpista' => $olimpista->idPersona,
                'nombre' => $persona->nombre,
                'apellido' => $persona->apellido,
                'curso' => $olimpista->curso,
                'colegio' => $olimpista->colegio,
                'carnetIdentidad' => $persona->carnetIdentidad,
                'fechaNacimiento' => $olimpista->fechaNacimiento,
                'departamento' => $olimpista->departamento,
                'provincia' => $olimpista->provincia,
                'correo' => $persona->correoElectronico,
                'areas' => $areas,
                'total_areas' => $areas->count()
            ];
        })->values();

        return response()->json([
            'success' => true,
            'total_olimpistas' => $resultado->count(),
            'data' => $resultado
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los olimpistas',
            'error' => $e->getMessage()
        ], 500);
    }
}



}
