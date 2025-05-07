<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\Tutor;
use App\Models\Olimpista;
use App\Models\Inscripcion;
use App\Models\OlimpiadaAreaCategoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class ExcelController extends Controller
{
    public function registerFromExcel(Request $request)
    {
        DB::beginTransaction();
        try {
            $responsibleData = $request->input('responsible');
            $olimpistasData = $request->input('olimpistas');
            $formaInscripcion = $request->input('formaInscripcion');

            // 1. Validar datos del responsable
            if (empty($responsibleData['Ci'])) {
                throw new \Exception('Carnet de identidad del responsable es requerido');
            }

            // 2. Registrar persona responsable
            $responsiblePerson = Persona::updateOrCreate(
                ['carnetIdentidad' => $responsibleData['Ci']],
                [
                    'nombre' => $responsibleData['Nombre'] ?? 'Responsable',
                    'apellido' => $responsibleData['Apellido'] ?? 'Inscripciones',
                    'correoElectronico' => $responsibleData['Email'] ?? null
                ]
            );

            // 3. Registrar tutor responsable
            $responsibleTutor = Tutor::updateOrCreate(
                ['idPersona' => $responsiblePerson->idPersona],
                [
                    'tipoTutor' => $responsibleData['Tipo_Tutor'] ?? 'Responsable',
                    'telefono' => $responsibleData['Numero_Celular'] ?? null
                ]
            );

            $registeredOlimpistas = [];
            $erroresRegistro = [];
            
            foreach ($olimpistasData as $index => $data) {
                try {
                    // 4. Validar datos mínimos del olimpista
                    if (empty($data[0])) {
                        throw new \Exception("Carnet de identidad del olimpista es requerido");
                    }

                    // 5. La fecha ya viene convertida desde el frontend (YYYY-MM-DD)
                    $fechaNacimiento = $data[3] ?? null;
                    
                    if (!$fechaNacimiento) {
                        throw new \Exception("Fecha de nacimiento es requerida");
                    }

                    // 6. Registrar persona olimpista
                    $olimpistaPerson = Persona::updateOrCreate(
                        ['carnetIdentidad' => $data[0]],
                        [
                            'nombre' => $data[1] ?? 'Sin nombre',
                            'apellido' => $data[2] ?? 'Sin apellido',
                            'correoElectronico' => $data[4] ?? null
                        ]
                    );

                    // 7. Registrar olimpista
                    $olimpista = Olimpista::updateOrCreate(
                        ['idPersona' => $olimpistaPerson->idPersona],
                        [
                            'fechaNacimiento' => $fechaNacimiento,
                            'departamento' => $data[5] ?? 'Sin departamento',
                            'municipio' => $data[6] ?? 'Sin municipio',
                            'colegio' => $data[7] ?? 'Sin colegio',
                            'curso' => $data[8] ?? 'Sin curso'
                        ]
                    );

                    // 8. Registrar tutor legal
                    if (empty($data[11])) {
                        throw new \Exception("Carnet de identidad del tutor legal es requerido");
                    }

                    $tutorLegalPerson = Persona::updateOrCreate(
                        ['carnetIdentidad' => $data[11]],
                        [
                            'nombre' => $data[12] ?? 'Sin nombre',
                            'apellido' => $data[13] ?? 'Sin apellido',
                            'correoElectronico' => $data[14] ?? null
                        ]
                    );

                    $tipoTutorLegal = !empty($data[16]) ? $this->normalizarTipoTutor($data[16]) : 'TUTOR LEGAL';

                    $tutorLegal = Tutor::updateOrCreate(
                        ['idPersona' => $tutorLegalPerson->idPersona],
                        [
                            'tipoTutor' => $tipoTutorLegal,
                            'telefono' => $data[15] ?? null
                        ]
                    );

                    // 9. Registrar tutor de área (opcional)
                    $tutorArea = null;
                    if (!empty($data[17])) {
                        $tutorAreaPerson = Persona::updateOrCreate(
                            ['carnetIdentidad' => $data[17]],
                            [
                                'nombre' => $data[18] ?? 'Sin nombre',
                                'apellido' => $data[19] ?? 'Sin apellido',
                                'correoElectronico' => $data[20] ?? null
                            ]
                        );

                        $tutorArea = Tutor::updateOrCreate(
                            ['idPersona' => $tutorAreaPerson->idPersona],
                            [
                                'tipoTutor' => 'PROFESOR',
                                'telefono' => $data[21] ?? null
                            ]
                        );
                    }

                    // 10. Obtener combinación área-categoría
                    if (empty($data[9])) {
                        throw new \Exception("Área no especificada");
                    }

                    if (empty($data[10])) {
                        throw new \Exception("Categoría no especificada");
                    }

                    $combination = OlimpiadaAreaCategoria::whereHas('area', function($q) use ($data) {
                            $q->where('nombreArea', $data[9]);
                        })
                        ->whereHas('categoria', function($q) use ($data) {
                            $q->where('nombreCategoria', $data[10]);
                        })
                        ->where('estado', 1)
                        ->first();

                    if (!$combination) {
                        throw new \Exception("Combinación de Área y Categoría no encontrada");
                    }

                    // 11. SOLUCIÓN CORREGIDA: Crear inscripción usando idPersona
                    $inscripcionData = [
                        'idOlimpista' => $olimpistaPerson->idPersona,
                        'idOlimpAreaCategoria' => $combination->idOlimpAreaCategoria,
                        'idTutorResponsable' => $responsibleTutor->idPersona,
                        'idTutorLegal' => $tutorLegal->idPersona,
                        'estadoInscripcion' => 0, // 0 para PENDIENTE, 1 para PAGADO (o según tu esquema)
                        'formaInscripcion' => $formaInscripcion
                    ];
                    
                    if ($tutorArea) {
                        $inscripcionData['idTutorArea'] = $tutorArea->idPersona;
                    }
                    
                    $inscripcion = Inscripcion::create($inscripcionData);

                    if (!$inscripcion) {
                        throw new \Exception("Error al crear la inscripción");
                    }

                    $registeredOlimpistas[] = $olimpista;

                } catch (\Exception $e) {
                    $erroresRegistro[] = "Fila " . ($index + 1) . ": " . $e->getMessage();
                    Log::error("Error registrando fila $index: " . $e->getMessage());
                    continue;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscripciones registradas correctamente',
                'data' => [
                    'olimpistas_registrados' => count($registeredOlimpistas),
                    'errores' => $erroresRegistro
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en registerFromExcel: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar inscripciones: ' . $e->getMessage()
            ], 500);
        }
    }

    private function normalizarTipoTutor($tipo)
    {
        $tipo = strtoupper(trim($tipo));
        
        if (strpos($tipo, 'PADRE') !== false || strpos($tipo, 'PAPÁ') !== false) {
            return 'PADRE';
        }
        
        if (strpos($tipo, 'MADRE') !== false || strpos($tipo, 'MAMÁ') !== false) {
            return 'MADRE';
        }
        
        return $tipo ?: 'TUTOR LEGAL';
    }

    public function getAvailableCombinations()
    {
        try {
            $combinations = OlimpiadaAreaCategoria::with(['area', 'categoria', 'olimpiada'])
                ->where('estado', 1)
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->idOlimpAreaCategoria,
                        'area' => $item->area->nombreArea,
                        'categoria' => $item->categoria->nombreCategoria,
                        'olimpiada' => $item->olimpiada->nombreOlimpiada,
                        'version' => $item->olimpiada->version
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $combinations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener combinaciones: ' . $e->getMessage()
            ], 500);
        }
    }
}