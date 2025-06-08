<?php

namespace App\Http\Controllers;

use App\Models\OlimpiadaAreaCategoria;
use App\Models\Inscripcion;
use App\Models\Persona;
use App\Models\Tutor;
use Illuminate\Http\Request;
use App\Models\Olimpista;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InscripcionController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'olimpista' => 'required|array',
            'responsable' => 'required|array',
            'tutor_legal' => 'required|array',
            'inscripciones' => 'required|array',
            'inscripciones.*.formaInscripcion' => 'required|string'
        ]);

        DB::beginTransaction();

        Log::info('Usuario creado correctamente', [$request]);


        try {
            // 1. Procesar el olimpista
            $olimpistaData = $request->olimpista;
            $personaOlimpista = $this->actualizarOCrearPersona($olimpistaData);
            $olimpista = $this->actualizarOCrearOlimpista($personaOlimpista->idPersona, $olimpistaData);

            // 2. Procesar el tutor responsable
            $responsableData = $request->responsable;
            if (isset($responsableData['id_persona'])) {
                $tutorResponsable = Tutor::find($responsableData['id_persona']);
            } else {
                $personaResponsable = $this->actualizarOCrearPersona($responsableData);
                $tutorResponsable = $this->actualizarOCrearTutor($personaResponsable->idPersona, $responsableData);
            }

            // 3. Procesar el tutor legal
            $tutorLegalData = $request->tutor_legal;
            $personaTutorLegal = $this->actualizarOCrearPersona($tutorLegalData);
            $tutorLegal = $this->actualizarOCrearTutor($personaTutorLegal->idPersona, $tutorLegalData);

            if ($request->filled('codigoInscripcion')) {
                    $codigoGrupo = $request->codigoInscripcion;
                } else {
                    $ultimoCodigo = Inscripcion::max('codigoInscripcion');
                    $ultimoNumero = $ultimoCodigo ? (int) ltrim($ultimoCodigo, '0') : 0;
                    $codigoGrupo = str_pad($ultimoNumero + 1, 3, '0', STR_PAD_LEFT);
                }

            // 4. Procesar las inscripciones
            foreach ($request->inscripciones as $inscripcionData) {
                // Procesar tutor de área si existe
                $tutorArea = null;
                if (isset($inscripcionData['existeTutor']) &&
                    filter_var($inscripcionData['existeTutor'], FILTER_VALIDATE_BOOLEAN) &&
                    isset($inscripcionData['tutorArea'])) {
                    $personaTutorArea = $this->actualizarOCrearPersona($inscripcionData['tutorArea']);
                    $tutorArea = $this->actualizarOCrearTutor($personaTutorArea->idPersona, $inscripcionData['tutorArea']);
                }


                $areaCategoria = OlimpiadaAreaCategoria::where('idArea', $inscripcionData['area'])
                ->where('idCategoria', $inscripcionData['categoria'])->where('idOlimpiada', $request['idOlimpiada'])
                ->first();


                // Crear la inscripción
                Inscripcion::create([
                    'idTutorResponsable' => $tutorResponsable->idPersona,
                    'idOlimpista' => $olimpista->idPersona,
                    'idOlimpAreaCategoria' => $areaCategoria->idOlimpAreaCategoria,
                    'estadoInscripcion' => false,
                    'idTutorLegal' => $tutorLegal->idPersona,
                    'idTutorArea' => $tutorArea ? $tutorArea->idPersona : null,
                    'formaInscripcion' => $inscripcionData['formaInscripcion'],
                    'registrandose' => $inscripcionData['registrandose'],
                    'codigoInscripcion' => $codigoGrupo,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscripción completada exitosamente',
                'data' => [
                    'olimpista_id' => $olimpista->idPersona,
                    'tutor_responsable_id' => $tutorResponsable->idPersona,
                    'codigoInscripcion' => $codigoGrupo
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la inscripción: ' . $e->getMessage(),
                'error_details' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Busca una persona por carnet de identidad o crea una nueva si no existe
     */
        private function actualizarOCrearPersona(array $data)
    {
        return Persona::updateOrCreate(
            ['carnetIdentidad' => $data['carnet_identidad']],
            [
                'nombre' => $data['nombre'],
                'apellido' => $data['apellido'],
                'correoElectronico' => $data['correo_electronico'] ?? null
            ]
        );
    }

    /**
     * Busca un olimpista por idPersona o lo actualiza/crea si no existe
     */
    private function actualizarOCrearOlimpista($idPersona, array $data)
    {
        return Olimpista::updateOrCreate(
            ['idPersona' => $idPersona],
            [
                'fechaNacimiento' => $data['fecha_nacimiento'],
                'departamento' => $data['departamento'],
                'municipio' => $data['municipio'],
                'curso' => $data['curso'],
                'colegio' => $data['colegio']
            ]
        );
    }

    /**
     * Busca un tutor por idPersona o lo actualiza/crea si no existe
     */
    private function actualizarOCrearTutor($idPersona, array $data)
    {
        return Tutor::updateOrCreate(
            ['idPersona' => $idPersona],
            [
                'tipoTutor' => $data['tipo_tutor'],
                'telefono' => $data['telefono']
            ]
        );
    }



    public function enableForIncription($carnet_identidad, $idOlimpiada){
        $olimpista = Persona::where("carnetIdentidad", $carnet_identidad)->first();
        if(!$olimpista) return;
        $inscripcionesExistentes = Inscripcion::where('idOlimpista', $olimpista->idPersona)
                    ->whereHas('olimpiadaAreaCategoria', function ($query) use ($idOlimpiada) {
                        $query->where('idOlimpiada', $idOlimpiada);
                    })
                    ->count();

            Log::info('Inscripciones existentes para el olimpista: ' . $inscripcionesExistentes);
            
            if ($inscripcionesExistentes >= 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'El olimpista ya está registrado en 2 áreas',
                    'data' => [
                        'olimpista_id' => $olimpista->idOlimpista,
                        'inscripciones_actuales' => $inscripcionesExistentes
                    ]
                ], 422);
            }
            return response()->json([
                'success' => true,
                'message' => 'El olimpista ya está habilitado',
                'data' => [
                    'olimpista_id' => $olimpista->idOlimpista,
                    'inscripciones_actuales' => $inscripcionesExistentes
                ]
            ]);
    }

    public function getAreaByOlimpista($id_olimpista)
    {
        // Verificar si el olimpista existe
        $olimpista = Olimpista::find($id_olimpista);
        
        if (!$olimpista) {
            return response()->json([
                'success' => false,
                'message' => 'Olimpista no encontrado'
            ], 404);
        }

        // Obtener las inscripciones del olimpista
        $inscripciones = Inscripcion::where('id_olimpista', $id_olimpista)->get();

        // Obtener los id_AreaCategoria únicos
        $areaCategoriaIds = $inscripciones->pluck('idOlimpAreaCategoria')->unique();

        // Obtener las áreas-categorías involucradas
        $areaCategorias = OlimpiadaAreaCategoria::with('area', 'categoria') // Asegúrate de tener estas relaciones
            ->whereIn('idOlimpAreaCategoria', $areaCategoriaIds)
            ->get();

        // Agrupar por área
        $areasConCategorias = $areaCategorias->groupBy('idArea')->map(function ($items, $areaId) {
            $area = $items->first()->area;

            return [
                'idArea' => $area->idArea,
                'nombreArea' => $area->nombreArea,
                'descripcionArea' => $area->descripcionArea,
                'costoArea' => $area->costoArea,
                'estadoArea' => $area->estadoArea,
                'categorias' => $items->map(function ($item) {
                    return [
                        'idCategoria' => $item->categoria->idCategoria ?? null,
                        'nombreCategoria' => $item->categoria->nombreCategoria ?? null,
                        'estadoCategoria' => $item->categoria->descripcionCategoria ?? null,
                    ];
                })->values()
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'olimpista' => $olimpista,
                'areas' => $areasConCategorias
            ]
        ], 200);
    }

    public function consultarInscripcion(Request $request)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'carnetIdentidad' => 'required|string',
            'correoElectronico' => 'required|email',
            'rol' => 'required|in:olimpista,tutor'
        ]);

        try {
            // 1. Primero buscamos la persona por CI y correo
            $persona = Persona::where('carnetIdentidad', $validated['carnetIdentidad'])
                            ->where('correoElectronico', $validated['correoElectronico'])
                            ->first();

            if (!$persona) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró ninguna persona con los datos proporcionados'
                ], 404);
            }

            if ($validated['rol'] === 'olimpista') {
                // 2. Buscamos las inscripciones del olimpista
                $inscripciones = Inscripcion::where('idOlimpista', $persona->idPersona)
                    ->with(['olimpiadaAreaCategoria.area', 'olimpiadaAreaCategoria.categoria'])
                    ->get();

                if ($inscripciones->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se encontraron inscripciones para este olimpista'
                    ], 404);
                }

                // 3. Obtenemos los datos del olimpista
                $olimpista = Olimpista::where('idPersona', $persona->idPersona)
                    ->first();

                // 4. Para cada inscripción, obtenemos el tutor responsable y el estado de pago
                $inscripcionesCompletas = $inscripciones->map(function ($inscripcion) {
                    // Obtener los datos del tutor responsable
                    $tutorInfo = DB::table('tutores')
                        ->join('personas', 'tutores.idPersona', '=', 'personas.idPersona')
                        ->where('tutores.idPersona', $inscripcion->idTutorResponsable)
                        ->select(
                            'personas.nombre',
                            'personas.apellido',
                            'personas.carnetIdentidad',
                            'personas.correoElectronico',
                            'tutores.tipoTutor',
                            'tutores.telefono'
                        )
                        ->first();

                    return [
                        'olimpiadaAreaCategoria' => [
                            'area' => $inscripcion->olimpiadaAreaCategoria->area,
                            'categoria' => $inscripcion->olimpiadaAreaCategoria->categoria
                        ],
                        'tutorResponsable' => $tutorInfo ? [
                            'nombre' => $tutorInfo->nombre,
                            'apellido' => $tutorInfo->apellido,
                            'carnetIdentidad' => $tutorInfo->carnetIdentidad,
                            'correoElectronico' => $tutorInfo->correoElectronico,
                            'tipoTutor' => $tutorInfo->tipoTutor,
                            'telefono' => $tutorInfo->telefono
                        ] : null,
                        'estadoInscripcion' => $inscripcion->estadoInscripcion,
                        'tutorArea' => $inscripcion->idTutorArea ? Persona::find($inscripcion->idTutorArea) : null
                    ];
                });

                return response()->json([
                    'success' => true,
                    'data' => [
                        'olimpista' => [
                            'nombre' => $persona->nombre,
                            'apellido' => $persona->apellido,
                            'carnetIdentidad' => $persona->carnetIdentidad,
                            'correoElectronico' => $persona->correoElectronico,
                            'fechaNacimiento' => $olimpista->fechaNacimiento,
                            'departamento' => $olimpista->departamento,
                            'municipio' => $olimpista->municipio,
                            'curso' => $olimpista->curso,
                            'colegio' => $olimpista->colegio
                        ],
                        'inscripciones' => $inscripcionesCompletas
                    ]
                ]);
            } else {
                // Caso tutor: buscamos las inscripciones donde esta persona es tutor (legal, responsable o área)
                $inscripcionesTutor = Inscripcion::where(function($query) use ($persona) {
                    $query->where('idTutorLegal', $persona->idPersona)
                        ->orWhere('idTutorResponsable', $persona->idPersona)
                        ->orWhere('idTutorArea', $persona->idPersona);
                })
                ->with([
                    'olimpiadaAreaCategoria.area',
                    'olimpiadaAreaCategoria.categoria',
                    'olimpista.persona'
                ])
                ->get();

                if ($inscripcionesTutor->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se encontraron inscripciones asociadas a este tutor'
                    ], 404);
                }

                // Obtener información del tutor
                $tutor = Tutor::where('idPersona', $persona->idPersona)->first();

                // Agrupar las inscripciones por olimpista
                $inscripcionesAgrupadas = $inscripcionesTutor->groupBy('idOlimpista');

                // Para cada olimpista, obtener la información completa
                $olimpistasInfo = $inscripcionesAgrupadas->map(function ($inscripciones) use ($persona) {
                    $primeraInscripcion = $inscripciones->first();
                    $olimpista = $primeraInscripcion->olimpista;
                    $personaOlimpista = $olimpista->persona;

                    // Determinar el tipo de tutor para este olimpista
                    $tipoTutor = [];
                    foreach ($inscripciones as $inscripcion) {
                        if ($inscripcion->idTutorLegal == $persona->idPersona) {
                            $tipoTutor[] = 'Tutor Legal';
                        }
                        if ($inscripcion->idTutorResponsable == $persona->idPersona) {
                            $tipoTutor[] = 'Tutor Responsable';
                        }
                        if ($inscripcion->idTutorArea == $persona->idPersona) {
                            $tipoTutor[] = 'Tutor de Área';
                        }
                    }

                    // Verificar si hay pagos pendientes
                    $tienePagosPendientes = $inscripciones->contains(function ($inscripcion) {
                        return $inscripcion->estadoInscripcion == 0;
                    });

                    return [
                        'nombre' => $personaOlimpista->nombre,
                        'apellido' => $personaOlimpista->apellido,
                        'carnetIdentidad' => $personaOlimpista->carnetIdentidad,
                        'tipoTutor' => implode(', ', array_unique($tipoTutor)),
                        'estadoPago' => $tienePagosPendientes ? 'PAGO PENDIENTE' : 'PAGO REALIZADO'
                    ];
                })->values();

                return response()->json([
                    'success' => true,
                    'data' => [
                        'tutor' => [
                            'nombre' => $persona->nombre,
                            'apellido' => $persona->apellido,
                            'carnetIdentidad' => $persona->carnetIdentidad,
                            'correoElectronico' => $persona->correoElectronico,
                            'telefono' => $tutor->telefono
                        ],
                        'olimpistas' => $olimpistasInfo
                    ]
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar la inscripción: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function getInscripcionesConOlimpiadas()
     {
         $inscripciones = Inscripcion::with(['olimpista', 'OlimpiadaAreaCategoria.olimpiada'])
             ->get();
 
         $result = $inscripciones->map(function ($inscripcion) {
             return [
                 'idInscripcion' => $inscripcion->idInscripcion,
                 'estadoInscripcion' => $inscripcion->estadoInscripcion,
                 'olimpista' => [
                     'nombre' => $inscripcion->olimpista->persona->nombre ?? '',
                     'apellido' => $inscripcion->olimpista->persona->apellido ?? '',
                     'carnet_identidad' => $inscripcion->olimpista->persona->carnetIdentidad ?? '',
                 ],
                 'idOlimpiada' => $inscripcion->OlimpiadaAreaCategoria->idOlimpiada ?? null,
             ];
         });
         
         return response()->json([
            'success' => true,
            'data' => $result,
        ], 200);
    }

public function finishRegister($idTutorResponsable, $codigoInscripcion)
{
    Inscripcion::where('idTutorResponsable', $idTutorResponsable)->where('codigoInscripcion', $codigoInscripcion)
        ->update(['registrandose' => false]);

    return response()->json([
        'success' => true,
        'message' => 'Registro finalizado correctamente'
    ]);
}

    public function verificarUsoAreasMasivo(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:areas,idArea',
        ]);

        $resultados = [];

        $areasEnUso = Inscripcion::whereHas('OlimpiadaAreaCategoria', function ($query) use ($request) {
            $query->whereIn('idArea', $request->ids);
        })->with('OlimpiadaAreaCategoria')->get();

        // Agrupa las inscripciones por idArea
        $agrupadas = $areasEnUso->groupBy(fn ($inscripcion) => $inscripcion->OlimpiadaAreaCategoria->idArea);

        foreach ($request->ids as $idArea) {
            $resultados[$idArea] = [
                'enUso' => $agrupadas->has($idArea),
                'inscripciones' => $agrupadas->get($idArea, collect()),
            ];
        }

        return response()->json($resultados);
    }


    public function verificarUsoCategoriasMasivo(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:categorias,idCategoria',
        ]);

        $resultados = [];

        foreach ($request->ids as $idCategoria) {
            $enUso = Inscripcion::whereHas('OlimpiadaAreaCategoria', function ($query) use ($idCategoria) {
                $query->where('idCategoria', $idCategoria);
            })->exists();

            $resultados[$idCategoria] = $enUso;
        }

        return response()->json($resultados);
    }

}
