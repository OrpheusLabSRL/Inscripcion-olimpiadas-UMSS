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

            // 1. Validar datos del responsable
            if (empty($responsibleData['Ci'])) {
                throw new \Exception('Carnet de identidad del responsable es requerido');
            }

            // 2. Validar todas las combinaciones área-categoría primero
            $errors = [];
            foreach ($olimpistasData as $index => $data) {
                try {
                    if (empty($data[9])) {
                        throw new \Exception("Área no especificada");
                    }

                    if (empty($data[10])) {
                        throw new \Exception("Categoría no especificada");
                    }

                    $combinationExists = OlimpiadaAreaCategoria::whereHas('area', function($q) use ($data) {
                            $q->where('nombreArea', $data[9]);
                        })
                        ->whereHas('categoria', function($q) use ($data) {
                            $q->where('nombreCategoria', $data[10]);
                        })
                        ->where('estado', 1)
                        ->exists();

                    if (!$combinationExists) {
                        throw new \Exception("Área o categoría no disponible en esta olimpiada");
                    }
                } catch (\Exception $e) {
                    $errors[] = "Fila " . ($index + 1) . ": " . $e->getMessage();
                }
            }

            if (!empty($errors)) {
                throw new \Exception(implode("\n", $errors));
            }

            // 3. Registrar persona responsable
            $responsiblePerson = Persona::updateOrCreate(
                ['carnetIdentidad' => $responsibleData['Ci']],
                [
                    'nombre' => $responsibleData['Nombre'] ?? 'Responsable',
                    'apellido' => $responsibleData['Apellido'] ?? 'Inscripciones',
                    'correoElectronico' => $responsibleData['Email'] ?? null
                ]
            );

            // 4. Registrar tutor responsable
            $responsibleTutor = Tutor::updateOrCreate(
                ['idPersona' => $responsiblePerson->idPersona],
                [
                    'tipoTutor' => $responsibleData['Tipo_Tutor'] ?? 'Responsable',
                    'telefono' => $responsibleData['Numero_Celular'] ?? null
                ]
            );

            $registeredOlimpistas = [];
            
            foreach ($olimpistasData as $index => $data) {
                // 5. Registrar persona olimpista
                $olimpistaPerson = Persona::updateOrCreate(
                    ['carnetIdentidad' => $data[0]],
                    [
                        'nombre' => $data[1] ?? 'Sin nombre',
                        'apellido' => $data[2] ?? 'Sin apellido',
                        'correoElectronico' => $data[4] ?? null
                    ]
                );

                // 6. Registrar olimpista
                $olimpista = Olimpista::updateOrCreate(
                    ['idPersona' => $olimpistaPerson->idPersona],
                    [
                        'fechaNacimiento' => $data[3] ?? null,
                        'departamento' => $data[5] ?? 'Sin departamento',
                        'municipio' => $data[6] ?? 'Sin municipio',
                        'colegio' => $data[7] ?? 'Sin colegio',
                        'curso' => $data[8] ?? 'Sin curso'
                    ]
                );

                // 7. Registrar tutor legal
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

                // 8. Registrar tutor de área (opcional)
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

                // 9. Obtener combinación área-categoría (ya validada)
                $combination = OlimpiadaAreaCategoria::whereHas('area', function($q) use ($data) {
                        $q->where('nombreArea', $data[9]);
                    })
                    ->whereHas('categoria', function($q) use ($data) {
                        $q->where('nombreCategoria', $data[10]);
                    })
                    ->where('estado', 1)
                    ->first();

                // 10. Crear inscripción
                $inscripcionData = [
                    'idOlimpista' => $olimpistaPerson->idPersona,
                    'idOlimpAreaCategoria' => $combination->idOlimpAreaCategoria,
                    'idTutorResponsable' => $responsibleTutor->idPersona,
                    'idTutorLegal' => $tutorLegal->idPersona,
                    'estadoInscripcion' => 0
                ];
                
                if ($tutorArea) {
                    $inscripcionData['idTutorArea'] = $tutorArea->idPersona;
                }
                
                $inscripcion = Inscripcion::create($inscripcionData);

                $registeredOlimpistas[] = $olimpista;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscripciones registradas correctamente',
                'data' => [
                    'olimpistas_registrados' => count($registeredOlimpistas)
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en registerFromExcel: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
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