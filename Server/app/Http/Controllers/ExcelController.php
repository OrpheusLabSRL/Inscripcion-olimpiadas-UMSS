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

class ExcelController extends Controller
{
    public function validateExcelData(Request $request)
{
    try {
        $olimpistasData = $request->input('olimpistas');
        $errors = [];

        // Obtener todas las áreas y categorías válidas
        $areasValidas = DB::table('areas')->pluck('nombreArea')->toArray();
        $categoriasValidas = DB::table('categorias')->pluck('nombreCategoria')->toArray();

        foreach ($olimpistasData as $rowIndex => $row) {
            $rowNumber = $rowIndex + 2;
            $hasAreaError = false;
            $hasCategoryError = false;

            // Validar área (columna 9)
            if (empty($row[9])) {
                $errors[] = "Fila $rowNumber: AREA es requerida";
                $hasAreaError = true;
            } else {
                // Verificar que el área exista (comparación case insensitive)
                $areaEncontrada = false;
                foreach ($areasValidas as $areaValida) {
                    if (strcasecmp(trim($row[9]), $areaValida) === 0) {
                        $areaEncontrada = true;
                        $row[9] = $areaValida; // Normalizar
                        break;
                    }
                }
                if (!$areaEncontrada) {
                    $errors[] = "Fila $rowNumber: El área '{$row[9]}' no existe en el sistema";
                    $hasAreaError = true;
                }
            }

            // Validar categoría (columna 10)
            if (empty($row[10])) {
                $errors[] = "Fila $rowNumber: CATEGORIA es requerida";
                $hasCategoryError = true;
            } else {
                // Verificar que la categoría exista (comparación case insensitive)
                $categoriaEncontrada = false;
                foreach ($categoriasValidas as $categoriaValida) {
                    if (strcasecmp(trim($row[10]), $categoriaValida) === 0) {
                        $categoriaEncontrada = true;
                        $row[10] = $categoriaValida; // Normalizar
                        break;
                    }
                }
                if (!$categoriaEncontrada) {
                    $errors[] = "Fila $rowNumber: La categoría '{$row[10]}' no existe en el sistema";
                    $hasCategoryError = true;
                }
            }

            // Solo verificar combinación si ambas son válidas
            if (!$hasAreaError && !$hasCategoryError) {
                $combinationExists = DB::table('olimpiadas_areas_categorias')
                    ->join('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
                    ->join('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
                    ->where('areas.nombreArea', $row[9])
                    ->where('categorias.nombreCategoria', $row[10])
                    ->exists();

                if (!$combinationExists) {
                    $errors[] = "Fila $rowNumber: La categoría '{$row[10]}' no está disponible para el área '{$row[9]}'";
                }
            }
        }

        return response()->json([
            'success' => empty($errors),
            'errors' => $errors
        ]);

    } catch (\Exception $e) {
        Log::error('Error en validateExcelData: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error al validar datos'
        ], 500);
    }
}

    public function registerFromExcel(Request $request)
    {
        DB::beginTransaction();
        try {
            $responsibleData = $request->input('responsible');
            $olimpistasData = $request->input('olimpistas');

            if (empty($responsibleData['Ci'])) {
                throw new \Exception('Carnet de identidad del responsable es requerido');
            }

            // Registrar persona responsable
            $responsiblePerson = Persona::updateOrCreate(
                ['carnetIdentidad' => $responsibleData['Ci']],
                [
                    'nombre' => $responsibleData['Nombre'] ?? 'Responsable',
                    'apellido' => $responsibleData['Apellido'] ?? 'Inscripciones',
                    'correoElectronico' => $responsibleData['Email'] ?? null
                ]
            );

            // Registrar tutor responsable
            $responsibleTutor = Tutor::updateOrCreate(
                ['idPersona' => $responsiblePerson->idPersona],
                [
                    'tipoTutor' => $responsibleData['Tipo_Tutor'] ?? 'Responsable',
                    'telefono' => $responsibleData['Numero_Celular'] ?? null
                ]
            );

            $registeredOlimpistas = [];
            
            foreach ($olimpistasData as $data) {
                // Validar combinación área-categoría antes de registrar
                $combination = OlimpiadaAreaCategoria::whereHas('area', function($q) use ($data) {
                        $q->where('nombreArea', $data[9]);
                    })
                    ->whereHas('categoria', function($q) use ($data) {
                        $q->where('nombreCategoria', $data[10]);
                    })
                    ->first();

                if (!$combination) {
                    throw new \Exception("La categoría '{$data[10]}' no está disponible para el área '{$data[9]}'");
                }

                // Registrar persona olimpista
                $olimpistaPerson = Persona::updateOrCreate(
                    ['carnetIdentidad' => $data[0]],
                    [
                        'nombre' => $data[1] ?? 'Sin nombre',
                        'apellido' => $data[2] ?? 'Sin apellido',
                        'correoElectronico' => $data[4] ?? null
                    ]
                );

                // Registrar olimpista
                Olimpista::updateOrCreate(
                    ['idPersona' => $olimpistaPerson->idPersona],
                    [
                        'fechaNacimiento' => $data[3] ?? null,
                        'departamento' => $data[5] ?? 'Sin departamento',
                        'municipio' => $data[6] ?? 'Sin municipio',
                        'colegio' => $data[7] ?? 'Sin colegio',
                        'curso' => $data[8] ?? 'Sin curso'
                    ]
                );

                // Registrar tutor legal
                $tutorLegalPerson = Persona::updateOrCreate(
                    ['carnetIdentidad' => $data[11]],
                    [
                        'nombre' => $data[12] ?? 'Sin nombre',
                        'apellido' => $data[13] ?? 'Sin apellido',
                        'correoElectronico' => $data[14] ?? null
                    ]
                );

                $tutorLegal = Tutor::updateOrCreate(
                    ['idPersona' => $tutorLegalPerson->idPersona],
                    [
                        'tipoTutor' => $this->normalizarTipoTutor($data[16] ?? 'TUTOR LEGAL'),
                        'telefono' => $data[15] ?? null
                    ]
                );

                // Registrar tutor de área (opcional)
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

                // Crear inscripción
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
                
                Inscripcion::create($inscripcionData);
                $registeredOlimpistas[] = $olimpistaPerson->idPersona;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($registeredOlimpistas) . ' olimpistas registrados correctamente'
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
            $combinations = OlimpiadaAreaCategoria::with(['area', 'categoria'])
                ->where('estado', 1)
                ->get()
                ->map(function($item) {
                    return [
                        'area' => $item->area->nombreArea,
                        'categoria' => $item->categoria->nombreCategoria
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $combinations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener combinaciones'
            ], 500);
        }
    }
}