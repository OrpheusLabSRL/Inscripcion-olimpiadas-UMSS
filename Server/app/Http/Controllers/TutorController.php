<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Models\Persona;
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

        // if ($validator->fails()) {
        //     $errors = $validator->errors();
            
        //     if ($errors->has('carnetdeidentidad')) {
        //         return response()->json([
        //             'success' => false,
        //             'error_code' => 'duplicate_ci',
        //             'message' => 'El carnet de identidad ya está registrado'
        //         ], 422);
        //     }
            
        //     if ($errors->has('emailTutor')) {
        //         return response()->json([
        //             'success' => false,
        //             'error_code' => 'duplicate_email',
        //             'message' => 'El correo electrónico ya está registrado'
        //         ], 422);
        //     }

        //     return response()->json([
        //         'success' => false,
        //         'errors' => $errors
        //     ], 422);
        // }

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
                    'estado' => true,
                    'rol' => $request->rol,
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

        $tutor = Persona::where('correoElectronico', $request->email)
                     ->where('carnetIdentidad', $request->carnet)
                     ->first();

        $inscripcion = Inscripcion::where('idTutorResponsable', $tutor->idPersona)->first();



        if ($inscripcion) {
            return response()->json([
                'exists' => true,
                'tutorId' => $tutor->idPersona,
                'data' => [
                    'nombresTutor' => $tutor->nombre,
                    'apellidosTutor' => $tutor->apellido,
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
        // Buscamos al olimpista
        $olimpista = Olimpista::findOrFail($id_olimpista);
        
        // Obtenemos las relaciones con los tutores
        $estudiante_tutores = OlimpistaTutor::with('tutor') // Asegúrate de tener la relación definida
            ->where('id_olimpista', $id_olimpista)
            ->get();
        
        // Si no hay relaciones
        if ($estudiante_tutores->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'El olimpista no tiene tutores asociados',
                'data' => []
            ], 200);
        }

        // Construimos la respuesta con los campos correctos
        $tutores_con_roles = $estudiante_tutores->map(function ($relacion) {
            $tutor = $relacion->tutor;

            return [
                'id_tutor' => $tutor->id_tutor,
                'nombre' => $tutor->nombre,
                'apellido' => $tutor->apellido,
                'tipoTutor' => $tutor->tipoTutor,
                'correo' => $tutor->correo,
                'numeroCelular' => $tutor->numeroCelular,
                'carnetIdentidad' => $tutor->carnetIdentidad,
                'rol' => $relacion->rol
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Tutores obtenidos correctamente',
            'data' => $tutores_con_roles
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Error al obtener los tutores: ' . $e->getMessage(),
            'data' => null
        ], 500);
    }
}

    public function getTutorWithPersona($id)
    {
        try {
            $tutor = Tutor::with('persona')->find($id);
            
            if (!$tutor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tutor no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'tutor' => $tutor
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos del tutor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}