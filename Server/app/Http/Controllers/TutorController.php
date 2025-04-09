<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tutor;
use App\Models\Olimpista;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
            'nombresTutor' => 'required|string|max:50|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            'apellidosTutor' => 'required|string|max:50|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            'tipoTutor' => 'required|string|in:Profesor,Padre/Madre,Tutor Legal',
            'carnetdeidentidad' => [
                'required',
                'string',
                'max:12',
                'regex:/^[a-zA-Z0-9]+$/',
                Rule::unique('tutores', 'carnetIdentidad')
            ],
            'telefono' => 'required|string|max:8|regex:/^[0-9]+$/',
            'emailTutor' => [
                'required',
                'email',
                'max:50',
                Rule::unique('tutores', 'correo')
            ]
        ], [
            'carnetdeidentidad.regex' => 'El carnet solo debe contener letras y números',
            'telefono.regex' => 'El teléfono solo debe contener números',
            'nombresTutor.regex' => 'El nombre solo debe contener letras',
            'apellidosTutor.regex' => 'El apellido solo debe contener letras',
            'tipoTutor.in' => 'Seleccione un tipo de tutor válido'
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
            'carnet' => 'required|string|regex:/^[a-zA-Z0-9]+$/'
        ], [
            'carnet.regex' => 'El carnet solo debe contener letras y números'
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
}