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
    public function validateExcelData(Request $request)
    {
        $data = $request->input('data');
        $errors = [];
        
        if (empty($data)) {
            return response()->json([
                'success' => false,
                'errors' => ['El archivo no contiene datos válidos']
            ], 400);
        }

        foreach ($data as $index => $row) {
            $rowNumber = $index + 2;

            // Validar campos obligatorios
            $requiredFields = [
                0 => 'CI Olimpista',
                1 => 'Nombre Olimpista',
                2 => 'Apellido Olimpista',
                3 => 'Fecha Nacimiento',
                11 => 'CI Tutor Legal',
                12 => 'Nombre Tutor Legal',
                13 => 'Apellido Tutor Legal',
                16 => 'Tipo Tutor'
            ];

            foreach ($requiredFields as $fieldIndex => $fieldName) {
                if (!isset($row[$fieldIndex]) || trim($row[$fieldIndex]) === '') {
                    $errors[] = "Fila $rowNumber: Falta el campo obligatorio '$fieldName'";
                }
            }

            // Validar formato de CI
            if (isset($row[0])) {
                $ci = trim($row[0]);
                if (!empty($ci) && !preg_match('/^[0-9]{7,12}$/', $ci)) {
                    $errors[] = "Fila $rowNumber: CI del olimpista no válido (debe contener solo números, 7-12 dígitos)";
                }
            }

            // Validar fecha de nacimiento
            if (isset($row[3])) {
                try {
                    $fecha = Carbon::createFromFormat('Y-m-d', $row[3]);
                    if (!$fecha || $fecha->greaterThan(now()->subYears(5))) {
                        $errors[] = "Fila $rowNumber: Fecha de nacimiento no válida o el olimpista es muy joven";
                    }
                } catch (\Exception $e) {
                    $errors[] = "Fila $rowNumber: Formato de fecha incorrecto (debe ser YYYY-MM-DD)";
                }
            }

            // Validar tipo de tutor
            if (isset($row[16])) {
                $tipoTutor = strtoupper(trim($row[16]));
                $tiposValidos = ['PADRE', 'MADRE', 'TUTOR LEGAL', 'PAPÁ', 'MAMÁ', 'PADRE/MADRE', 'MAMÁ/PAPÁ'];
                
                if (!empty($tipoTutor) && !in_array($tipoTutor, $tiposValidos)) {
                    $errors[] = "Fila $rowNumber: Tipo de tutor no válido. Debe ser: " . implode(', ', $tiposValidos);
                }
            }

            // Validar área y categoría
            if (isset($row[9]) && isset($row[10])) {
                $area = trim($row[9]);
                $categoria = trim($row[10]);
                
                $combinacionValida = OlimpiadaAreaCategoria::whereHas('area', function($q) use ($area) {
                    $q->where('nombreArea', $area);
                })
                ->whereHas('categoria', function($q) use ($categoria) {
                    $q->where('nombreCategoria', $categoria);
                })
                ->where('estado', 1) // Cambiado a estado = 1
                ->exists();
                
                if (!$combinacionValida) {
                    $errors[] = "Fila $rowNumber: Combinación de Área ($area) y Categoría ($categoria) no válida";
                }
            }
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'errors' => $errors
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Datos validados correctamente'
        ]);
    }

    public function registerFromExcel(Request $request)
    {
        DB::beginTransaction();
        try {
            $responsibleData = $request->input('responsible');
            $olimpistasData = $request->input('olimpistas');

            // Validar datos del responsable
            if (empty($responsibleData['Ci']) || empty($responsibleData['Nombre']) || empty($responsibleData['Apellido'])) {
                throw new \Exception('Datos del responsable incompletos');
            }

            // 1. Registrar persona responsable
            $responsiblePerson = Persona::updateOrCreate(
                ['carnetIdentidad' => $responsibleData['Ci']],
                [
                    'nombre' => $responsibleData['Nombre'],
                    'apellido' => $responsibleData['Apellido'],
                    'correoElectronico' => $responsibleData['Email'] ?? null
                ]
            );

            // 2. Registrar tutor responsable
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
                    // Validar datos mínimos del olimpista
                    if (empty($data[0]) || empty($data[1]) || empty($data[2])) {
                        $erroresRegistro[] = "Fila " . ($index + 1) . ": Datos incompletos del olimpista";
                        continue;
                    }

                    // 3. Registrar persona olimpista
                    $olimpistaPerson = Persona::updateOrCreate(
                        ['carnetIdentidad' => $data[0]],
                        [
                            'nombre' => $data[1] ?? 'Sin nombre',
                            'apellido' => $data[2] ?? 'Sin apellido',
                            'correoElectronico' => $data[4] ?? null
                        ]
                    );

                    // 4. Registrar olimpista
                    $olimpista = Olimpista::updateOrCreate(
                        ['idPersona' => $olimpistaPerson->idPersona],
                        [
                            'fechaNacimiento' => !empty($data[3]) ? Carbon::createFromFormat('Y-m-d', $data[3]) : null,
                            'departamento' => $data[5] ?? null,
                            'municipio' => $data[6] ?? null,
                            'colegio' => $data[7] ?? null,
                            'curso' => $data[8] ?? null
                        ]
                    );

                    // 5. Registrar tutor legal
                    if (empty($data[11]) || empty($data[12]) || empty($data[13])) {
                        $erroresRegistro[] = "Fila " . ($index + 1) . ": Datos incompletos del tutor legal";
                        continue;
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

                    // 6. Registrar tutor de área si existe
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

                    // 7. Obtener combinación área-categoría-olimpiada
                    if (empty($data[9]) || empty($data[10])) {
                        $erroresRegistro[] = "Fila " . ($index + 1) . ": Área o categoría no especificada";
                        continue;
                    }

                    $combination = OlimpiadaAreaCategoria::whereHas('area', function($q) use ($data) {
                            $q->where('nombreArea', $data[9]);
                        })
                        ->whereHas('categoria', function($q) use ($data) {
                            $q->where('nombreCategoria', $data[10]);
                        })
                        ->where('estado', 1) // Cambiado a estado = 1
                        ->first();

                    if (!$combination) {
                        $erroresRegistro[] = "Fila " . ($index + 1) . ": Combinación de Área ({$data[9]}) y Categoría ({$data[10]}) no encontrada o no activa";
                        continue;
                    }

                    // 8. Verificar si ya existe la inscripción
                    $inscripcionExistente = Inscripcion::where('idOlimpista', $olimpista->idOlimpista)
                        ->where('idOlimpAreaCategoria', $combination->idOlimpAreaCategoria)
                        ->exists();

                    if ($inscripcionExistente) {
                        $erroresRegistro[] = "Fila " . ($index + 1) . ": El olimpista ya está inscrito en esta área y categoría";
                        continue;
                    }

                    // 9. Crear inscripción
                    Inscripcion::create([
                        'idTutorResponsable' => $responsibleTutor->idTutor,
                        'idOlimpista' => $olimpista->idOlimpista,
                        'idCodigoBoleta' => null,
                        'idOlimpAreaCategoria' => $combination->idOlimpAreaCategoria,
                        'estadoInscripcion' => 'PENDIENTE PAGO',
                        'idTutorLegal' => $tutorLegal->idTutor,
                        'idTutorArea' => $tutorArea ? $tutorArea->idTutor : null
                    ]);

                    $registeredOlimpistas[] = $olimpista;

                } catch (\Exception $e) {
                    $erroresRegistro[] = "Fila " . ($index + 1) . ": Error al registrar - " . $e->getMessage();
                    continue;
                }
            }

            DB::commit();

            $response = [
                'success' => true,
                'message' => 'Inscripciones registradas correctamente',
                'data' => [
                    'responsible' => $responsiblePerson,
                    'olimpistas_registrados' => count($registeredOlimpistas),
                    'errores' => $erroresRegistro
                ]
            ];

            return response()->json($response);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar inscripciones: ' . $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }

    private function normalizarTipoTutor($tipo)
    {
        $tipo = strtoupper(trim($tipo));
        
        if (str_contains($tipo, 'PADRE') || str_contains($tipo, 'PAPÁ')) {
            return 'PADRE';
        }
        
        if (str_contains($tipo, 'MADRE') || str_contains($tipo, 'MAMÁ')) {
            return 'MADRE';
        }
        
        return $tipo;
    }

    public function getAvailableCombinations()
    {
        try {
            $combinations = OlimpiadaAreaCategoria::with(['area', 'categoria', 'olimpiada'])
                ->where('estado', 1) // Cambiado a estado = 1
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