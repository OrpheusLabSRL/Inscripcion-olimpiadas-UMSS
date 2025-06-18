<?php

namespace App\Http\Controllers;

//services
use App\Services\InscripcionService;

//Requests
use App\Http\Requests\InscripcionRequest;
use App\Http\Requests\ConsultaInscripcionRequest;

//Interfaces
use App\Repositories\Contracts\InscripcionRepositoryInterface;


use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class InscripcionController extends Controller
{
    private InscripcionService $inscripcionService;
    private InscripcionRepositoryInterface $inscripcionRepository;

    public function __construct(
        InscripcionService $inscripcionService,
        InscripcionRepositoryInterface $inscripcionRepository
    ) {
        $this->inscripcionService = $inscripcionService;
        $this->inscripcionRepository = $inscripcionRepository;
    }

    /**
     * Crear nueva inscripción
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Iniciando proceso de inscripción', ['data' => $request]);

            $result = $this->inscripcionService->crearInscripcion($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Inscripción completada exitosamente',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            Log::error('Error al procesar inscripción', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la inscripción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar si un olimpista puede inscribirse
     */
    public function enableForIncription(string $carnet_identidad, int $idOlimpiada): JsonResponse
    {
        try {
            $result = $this->inscripcionService->verificarElegibilidadOlimpista($carnet_identidad, $idOlimpiada);
            
            return response()->json($result, $result['success'] ? 200 : 422);

        } catch (\Exception $e) {
            Log::error('Error al verificar elegibilidad', [
                'carnet' => $carnet_identidad,
                'olimpiada' => $idOlimpiada,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al verificar elegibilidad del olimpista'
            ], 500);
        }
    }

    /**
     * Obtener áreas por olimpista
     */
    public function getAreaByOlimpista(int $id_olimpista): JsonResponse
    {
        try {
            $result = $this->inscripcionService->obtenerAreasPorOlimpista($id_olimpista);
            
            return response()->json($result, $result['success'] ? 200 : 404);

        } catch (\Exception $e) {
            Log::error('Error al obtener áreas del olimpista', [
                'olimpista_id' => $id_olimpista,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las áreas del olimpista'
            ], 500);
        }
    }

    /**
     * Consultar inscripción por CI y correo
     */
    public function consultarInscripcion(ConsultaInscripcionRequest $request): JsonResponse
    {
        try {
            $result = $this->inscripcionService->consultarInscripcion($request->validated());
            
            return response()->json($result, $result['success'] ? 200 : 404);

        } catch (\Exception $e) {
            Log::error('Error al consultar inscripción', [
                'data' => $request->validated(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al consultar la inscripción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener inscripciones con olimpiadas
     */
    public function getInscripcionesConOlimpiadas(): JsonResponse
    {
        try {
            $inscripciones = $this->inscripcionRepository->obtenerInscripcionesConOlimpiadas();
            
            return response()->json([
                'success' => true,
                'data' => $inscripciones
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener inscripciones con olimpiadas', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las inscripciones'
            ], 500);
        }
    }

    /**
     * Finalizar registro
     */
    public function finishRegister(int $idTutorResponsable, string $codigoInscripcion): JsonResponse
    {
        try {
            $this->inscripcionService->finalizarRegistro($idTutorResponsable, $codigoInscripcion);

            return response()->json([
                'success' => true,
                'message' => 'Registro finalizado correctamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al finalizar registro', [
                'tutor_id' => $idTutorResponsable,
                'codigo' => $codigoInscripcion,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al finalizar el registro'
            ], 500);
        }
    }

    /**
     * Verificar uso de áreas en forma masiva
     */
    public function verificarUsoAreasMasivo(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:areas,idArea',
        ]);

        try {
            $resultado = $this->inscripcionService->verificarUsoAreasMasivo($request->ids);
            
            return response()->json($resultado);

        } catch (\Exception $e) {
            Log::error('Error al verificar uso de áreas', [
                'ids' => $request->ids,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al verificar el uso de las áreas'
            ], 500);
        }
    }

    /**
     * Verificar uso de categorías en forma masiva
     */
    public function verificarUsoCategoriasMasivo(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:categorias,idCategoria',
        ]);

        try {
            $resultado = $this->inscripcionService->verificarUsoCategoriasMasivo($request->ids);
            
            return response()->json($resultado);

        } catch (\Exception $e) {
            Log::error('Error al verificar uso de categorías', [
                'ids' => $request->ids,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al verificar el uso de las categorías'
            ], 500);
        }
    }
}