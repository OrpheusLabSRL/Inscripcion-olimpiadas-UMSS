<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tutor;
use App\Models\OlimpistaTutor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Olimpista;

class TutorController extends Controller
{
    public function getEstudiantes($id_tutor)
    {
        $tutor = Tutor::find($id_tutor);

        if (!$tutor) {
            return response()->json(['error' => 'Tutor no encontrado'], 404);
        }

        $estudiantes = $tutor->olimpistas; 
        return response()->json($estudiantes);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombresTutor' => 'required|string|max:50',
            'apellidosTutor' => 'required|string|max:50',
            'tipoTutor' => 'required|string|max:15',
            'carnetdeidentidad' => [
                'required',
                'string',
                'max:15',
                Rule::unique('tutores', 'carnetIdentidad')
            ],
            'telefono' => 'required|string|max:15',
            'emailTutor' => [
                'required',
                'email',
                'max:50',
                Rule::unique('tutores', 'correo')
            ],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            
            if ($errors->has('carnetdeidentidad')) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'duplicate_ci',
                    'message' => 'El carnet de identidad ya está registrado'
                ], 422);
            }
            
            if ($errors->has('emailTutor')) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'duplicate_email',
                    'message' => 'El correo electrónico ya está registrado'
                ], 422);
            }

            return response()->json([
                'success' => false,
                'errors' => $errors
            ], 422);
        }

        try {
            $tutor = Tutor::create([
                'nombre' => $request->nombresTutor,
                'apellido' => $request->apellidosTutor,
                'tipoTutor' => $request->tipoTutor,
                'carnetIdentidad' => $request->carnetdeidentidad,
                'numeroCelular' => $request->telefono,
                'correo' => $request->emailTutor
            ]);

            if ($request->filled('id_olimpista')) {
                OlimpistaTutor::create([
                    'id_tutor' => $tutor->id_tutor,
                    'id_olimpista' => $request->id_olimpista,
                    'estado' => true
                ]);
            }
            return response()->json([
                'success' => true,
                'message' => 'Tutor registrado exitosamente',
                'tutorId' => $tutor->id_tutor,
                'tutorData' => $tutor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar el tutor: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkExistingTutor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'carnet' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $tutor = Tutor::where('correo', $request->email)
                     ->where('carnetIdentidad', $request->carnet)
                     ->first();

        if ($tutor) {
            return response()->json([
                'exists' => true,
                'tutorId' => $tutor->id_tutor,
                'data' => [
                    'nombresTutor' => $tutor->nombre,
                    'apellidosTutor' => $tutor->apellido,
                    'tipoTutor' => $tutor->tipoTutor,
                    'carnetdeidentidad' => $tutor->carnetIdentidad,
                    'telefono' => $tutor->numeroCelular,
                    'emailTutor' => $tutor->correo
                ]
            ]);
        }

        return response()->json([
            'exists' => false,
            'message' => 'No se encontró un tutor con esos datos'
        ]);
    }

    public function getTutoresByOlimpista($id_olimpista)
    {
        try {
            // Buscamos el olimpista por su ID
            $olimpista = Olimpista::findOrFail($id_olimpista);
            
            // Obtenemos los estudiante_tutor relacionados con este olimpista
            $estudiante_tutores = OlimpistaTutor::where('id_olimpista', $id_olimpista)->get();
            
            // Si no hay relaciones, devolvemos un array vacío
            if ($estudiante_tutores->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'El olimpista no tiene tutores asociados',
                    'data' => []
                ], 200);
            }
            
            // Extraemos los IDs de tutores de las relaciones
            $id_tutores = $estudiante_tutores->pluck('id_tutor')->toArray();
            
            // Obtenemos los tutores por sus IDs
            $tutores = Tutor::whereIn('id_tutor', $id_tutores)->get();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Tutores obtenidos correctamente',
                'data' => $tutores
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener los tutores: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}