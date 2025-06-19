<?php

namespace App\Services;

use App\Models\Inscripcion;
use App\Models\Persona;
use App\Models\Olimpista;
use App\Models\Tutor;
use App\Models\OlimpiadaAreaCategoria;
use App\Repositories\Contracts\InscripcionRepositoryInterface;
use App\Repositories\Contracts\PersonaRepositoryInterface;
use App\Repositories\Contracts\OlimpistaRepositoryInterface;
use App\Repositories\Contracts\TutorRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InscripcionService
{
    private InscripcionRepositoryInterface $inscripcionRepository;
    private PersonaRepositoryInterface $personaRepository;
    private OlimpistaRepositoryInterface $olimpistaRepository;
    private TutorRepositoryInterface $tutorRepository;

    public function __construct(
        InscripcionRepositoryInterface $inscripcionRepository,
        PersonaRepositoryInterface $personaRepository,
        OlimpistaRepositoryInterface $olimpistaRepository,
        TutorRepositoryInterface $tutorRepository
    ) {
        $this->inscripcionRepository = $inscripcionRepository;
        $this->personaRepository = $personaRepository;
        $this->olimpistaRepository = $olimpistaRepository;
        $this->tutorRepository = $tutorRepository;
    }

    /**
     * Crear nueva inscripción
     */
    public function crearInscripcion(array $data): array
    {
        DB::beginTransaction();

        try {
            $personaOlimpista = $this->personaRepository->actualizarOCrear(
                ['carnetIdentidad' => $data['olimpista']['carnet_identidad']],
                [
                    'nombre' => $data['olimpista']['nombre'],
                    'apellido' => $data['olimpista']['apellido'],
                    'correoElectronico' => $data['olimpista']['correo_electronico'] ?? null
                ]
            );

            $olimpista = $this->olimpistaRepository->actualizarOCrear(
                ['idPersona' => $personaOlimpista->idPersona],
                [
                    'fechaNacimiento' => $data['olimpista']['fecha_nacimiento'],
                    'departamento' => $data['olimpista']['departamento'],
                    'municipio' => $data['olimpista']['municipio'],
                    'curso' => $data['olimpista']['curso'],
                    'colegio' => $data['olimpista']['colegio']
                ]
            );

            // 2. Procesar el tutor responsable
            $tutorResponsable = $this->procesarTutor($data['responsable']);

            // 3. Procesar el tutor legal
            $tutorLegal = $this->procesarTutor($data['tutor_legal']);

            // 4. Generar código de inscripción
            $codigoGrupo = $this->generarCodigoInscripcion($data);

            // 5. Procesar las inscripciones
            foreach ($data['inscripciones'] as $inscripcionData) {
                $tutorArea = null;
                
                if (isset($inscripcionData['existeTutor']) &&
                    filter_var($inscripcionData['existeTutor'], FILTER_VALIDATE_BOOLEAN) &&
                    isset($inscripcionData['tutorArea'])) {
                    $tutorArea = $this->procesarTutor($inscripcionData['tutorArea']);
                }

                $areaCategoria = OlimpiadaAreaCategoria::where('idArea', $inscripcionData['area'])
                    ->where('idCategoria', $inscripcionData['categoria'])
                    ->where('idOlimpiada', $data['idOlimpiada'])
                    ->firstOrFail();

                $this->inscripcionRepository->crear([
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

            return [
                'olimpista_id' => $olimpista->idPersona,
                'tutor_responsable_id' => $tutorResponsable->idPersona,
                'codigoInscripcion' => $codigoGrupo
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Verificar elegibilidad del olimpista
     */
    public function verificarElegibilidadOlimpista(string $carnetIdentidad, int $idOlimpiada): array
    {
        $olimpista = $this->personaRepository->buscarPorCarnet($carnetIdentidad);
        // Log::info('Olimpista: ', [$olimpista]);

        if (!$olimpista) {
            return [
                'success' => false,
                'message' => 'Olimpista no encontrado'
            ];
        }

        $inscripcionesExistentes = $this->inscripcionRepository->contarInscripcionesPorOlimpiada(
            $olimpista->idPersona, 
            $idOlimpiada
        );

        // Log::info('Inscripciones existentes para el olimpista: ' , [$inscripcionesExistentes]);

        if ($inscripcionesExistentes >= 2) {
            return [
                'success' => false,
                'message' => 'El olimpista ya está registrado en 2 áreas',
                'data' => [
                    'olimpista_id' => $olimpista->idPersona,
                    'inscripciones_actuales' => $inscripcionesExistentes
                ]
            ];
        }

        return [
            'success' => true,
            'message' => 'El olimpista está habilitado para inscribirse',
            'data' => [
                'olimpista_id' => $olimpista->idPersona,
                'inscripciones_actuales' => $inscripcionesExistentes
            ]
        ];
    }

    /**
     * Obtener áreas por olimpista
     */
    public function obtenerAreasPorOlimpista(int $idOlimpista): array
    {
        $olimpista = $this->olimpistaRepository->buscarPorId($idOlimpista);
        
        if (!$olimpista) {
            return [
                'success' => false,
                'message' => 'Olimpista no encontrado'
            ];
        }

        $areasConCategorias = $this->inscripcionRepository->obtenerAreasConCategoriasPorOlimpista($idOlimpista);

        return [
            'success' => true,
            'data' => [
                'olimpista' => $olimpista,
                'areas' => $areasConCategorias
            ]
        ];
    }

    /**
     * Consultar inscripción
     */
    public function consultarInscripcion(array $data): array
    {
        $persona = $this->personaRepository->buscarPorCarnetYCorreo(
            $data['carnetIdentidad'], 
            $data['correoElectronico']
        );

        if (!$persona) {
            return [
                'success' => false,
                'message' => 'No se encontró ninguna persona con los datos proporcionados'
            ];
        }

        if ($data['rol'] === 'olimpista') {
            return $this->consultarInscripcionOlimpista($persona);
        } else {
            return $this->consultarInscripcionTutor($persona);
        }
    }

    /**
     * Finalizar registro
     */
    public function finalizarRegistro(int $idTutorResponsable, string $codigoInscripcion): void
    {
        $this->inscripcionRepository->finalizarRegistro($idTutorResponsable, $codigoInscripcion);
    }

    /**
     * Verificar uso de áreas en forma masiva
     */
    public function verificarUsoAreasMasivo(array $ids): array
    {
        return $this->inscripcionRepository->verificarUsoAreasMasivo($ids);
    }

    /**
     * Verificar uso de categorías en forma masiva
     */
    public function verificarUsoCategoriasMasivo(array $ids): array
    {
        return $this->inscripcionRepository->verificarUsoCategoriasMasivo($ids);
    }

    /**
     * Procesar datos de tutor
     */
    private function procesarTutor(array $data): Tutor
{
    if (isset($data['id_persona'])) {
        return $this->tutorRepository->buscarPorId($data['id_persona']);
    }

    $persona = $this->personaRepository->actualizarOCrear(
        ['carnetIdentidad' => $data['carnet_identidad']],
        [
            'nombre' => $data['nombre'],
            'apellido' => $data['apellido'],
            'correoElectronico' => $data['correo_electronico'] ?? null
        ]
    );

    $tutorData = [
        'telefono' => $data['telefono'],
    ];

    if (!empty($data['tipo_tutor'])) {
        $tutorData['tipoTutor'] = $data['tipo_tutor'];
    }

    return $this->tutorRepository->actualizarOCrear(
        ['idPersona' => $persona->idPersona],
        $tutorData
    );
}


    /**
     * Generar código de inscripción
     */
    private function generarCodigoInscripcion(array $data): string
    {
        if (isset($data['codigoInscripcion']) && !empty($data['codigoInscripcion'])) {
            return $data['codigoInscripcion'];
        }

        $ultimoCodigo = $this->inscripcionRepository->obtenerUltimoCodigoInscripcion();
        $ultimoNumero = $ultimoCodigo ? (int) ltrim($ultimoCodigo, '0') : 0;
        
        return str_pad($ultimoNumero + 1, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Consultar inscripción de olimpista
     */
    private function consultarInscripcionOlimpista(Persona $persona): array
    {
        $inscripciones = $this->inscripcionRepository->obtenerInscripcionesPorOlimpista($persona->idPersona);

        if ($inscripciones->isEmpty()) {
            return [
                'success' => false,
                'message' => 'No se encontraron inscripciones para este olimpista'
            ];
        }

        $olimpista = $this->olimpistaRepository->buscarPorPersona($persona->idPersona);
        $inscripcionesCompletas = $this->inscripcionRepository->procesarInscripcionesCompletas($inscripciones);

        return [
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
        ];
    }

    /**
     * Consultar inscripción de tutor
     */
    private function consultarInscripcionTutor(Persona $persona): array
    {
        $inscripcionesTutor = $this->inscripcionRepository->obtenerInscripcionesPorTutor($persona->idPersona);

        if ($inscripcionesTutor->isEmpty()) {
            return [
                'success' => false,
                'message' => 'No se encontraron inscripciones asociadas a este tutor'
            ];
        }

        $tutor = $this->tutorRepository->buscarPorPersona($persona->idPersona);
        $olimpistasInfo = $this->inscripcionRepository->procesarInscripcionesTutor($inscripcionesTutor, $persona);

        return [
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
        ];
    }
}