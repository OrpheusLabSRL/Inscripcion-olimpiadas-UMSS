<?php

namespace App\Http\Controllers;

use App\Models\OlimpiadaAreaCategoria;
use App\Models\Inscripcion;
use App\Models\Persona;
use App\Models\Tutor;
use Illuminate\Http\Request;
use App\Models\Olimpista;
use Illuminate\Support\Facades\DB;

class InscripcionController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'olimpista' => 'required|array',
            'responsable' => 'required|array',
            'tutor_legal' => 'required|array',
            'inscripciones' => 'required|array'
        ]);

        // \Log::info('Datos recibidos en store:', $request->all());

        DB::beginTransaction();

        try {
            // 1. Procesar el olimpista
            $olimpistaData = $request->olimpista;
            $personaOlimpista = $this->buscarOCrearPersona($olimpistaData);
            $olimpista = $this->buscarOCrearOlimpista($personaOlimpista->idPersona, $olimpistaData);

            // 2. Procesar el tutor responsable
            $responsableData = $request->responsable;
            if (isset($responsableData['id_persona'])) {
                $tutorResponsable = Tutor::find($responsableData['id_persona']);
            } else {
                $personaResponsable = $this->buscarOCrearPersona($responsableData);
                $tutorResponsable = $this->buscarOCrearTutor($personaResponsable->idPersona, $responsableData);
            }

            // 3. Procesar el tutor legal
            $tutorLegalData = $request->tutor_legal;
            $personaTutorLegal = $this->buscarOCrearPersona($tutorLegalData);
            $tutorLegal = $this->buscarOCrearTutor($personaTutorLegal->idPersona, $tutorLegalData);

            // 4. Procesar las inscripciones
            foreach ($request->inscripciones as $inscripcionData) {
                // Procesar tutor de área si existe
                $tutorArea = null;
                if (isset($inscripcionData['existeTutor']) && $inscripcionData['existeTutor'] == "true" && isset($inscripcionData['tutorArea'])) {
                    $personaTutorArea = $this->buscarOCrearPersona($inscripcionData['tutorArea']);
                    $tutorArea = $this->buscarOCrearTutor($personaTutorArea->idPersona, $inscripcionData['tutorArea']);
                }


                $areaCategoria = OlimpiadaAreaCategoria::where('idArea', $inscripcionData['area'])
                ->where('idCategoria', $inscripcionData['categoria'])
                ->first();

                // Crear la inscripción
                Inscripcion::create([
                    'idTutorResponsable' => $tutorResponsable->idPersona,
                    'idOlimpista' => $olimpista->idPersona,
                    'idOlimpAreaCategoria' => $areaCategoria->idOlimpAreaCategoria,
                    'estadoInscripcion' => false,
                    'idTutorLegal' => $tutorLegal->idPersona,
                    'idTutorArea' => $tutorArea ? $tutorArea->idPersona : null
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscripción completada exitosamente',
                'data' => [
                    'olimpista_id' => $olimpista->idPersona,
                    'tutor_responsable_id' => $tutorResponsable->idPersona
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
    private function buscarOCrearPersona(array $data)
    {
        return Persona::firstOrCreate(
            ['carnetIdentidad' => $data['carnet_identidad']],
            [
                'nombre' => $data['nombre'],
                'apellido' => $data['apellido'],
                'correoElectronico' => $data['correo_electronico'] ?? null
            ]
        );
    }

    /**
     * Busca un clímpista por idPersona o crea uno nuevo si no existe
     */
    private function buscarOCrearOlimpista($idPersona, array $data)
    {
        return Olimpista::firstOrCreate(
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
     * Busca un tutor por idPersona o crea uno nuevo si no existe
     */
    private function buscarOCrearTutor($idPersona, array $data)
    {
        return Tutor::firstOrCreate(
            ['idPersona' => $idPersona],
            [
                'tipoTutor' => $data['tipo_tutor'],
                'telefono' => $data['telefono']
            ]
        );
    }


    public function enableForIncription($carnet_identidad){
        $olimpista = Persona::where("carnetIdentidad", $carnet_identidad)->first();
        if(!$olimpista) return;
        $inscripcionesExistentes = Inscripcion::where('idOlimpista', $olimpista->idPersona)->count();
            
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


}
