<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InscripcionRequest extends FormRequest
{
    /**
     * Determinar si el usuario está autorizado para hacer esta petición.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Obtener las reglas de validación que se aplican a la petición.
     */
    public function rules(): array
    {
        return [
            'olimpista' => 'required|array',
            'olimpista.nombre' => 'required|string|max:255',
            'olimpista.apellido' => 'required|string|max:255',
            'olimpista.carnet_identidad' => 'required|string|max:20',
            'olimpista.correo_electronico' => 'nullable|email|max:255',
            'olimpista.fecha_nacimiento' => 'required|date',
            'olimpista.departamento' => 'required|string|max:255',
            'olimpista.municipio' => 'required|string|max:255',
            'olimpista.curso' => 'required|string|max:100',
            'olimpista.colegio' => 'required|string|max:255',

            'responsable' => 'required|array',
            'responsable.nombre' => 'required|string|max:255',
            'responsable.apellido' => 'required|string|max:255',
            'responsable.carnet_identidad' => 'required|string|max:20',
            'responsable.correo_electronico' => 'nullable|email|max:255',
            'responsable.tipo_tutor' => 'required|string|max:100',
            'responsable.telefono' => 'required|string|max:20',

            'tutor_legal' => 'required|array',
            'tutor_legal.nombre' => 'required|string|max:255',
            'tutor_legal.apellido' => 'required|string|max:255',
            'tutor_legal.carnet_identidad' => 'required|string|max:20',
            'tutor_legal.correo_electronico' => 'nullable|email|max:255',
            'tutor_legal.tipo_tutor' => 'required|string|max:100',
            'tutor_legal.telefono' => 'required|string|max:20',

            'inscripciones' => 'required|array|min:1',
            'inscripciones.*.area' => 'required|integer|exists:areas,idArea',
            'inscripciones.*.categoria' => 'required|integer|exists:categorias,idCategoria',
            'inscripciones.*.formaInscripcion' => 'required|string|max:100',
            'inscripciones.*.registrandose' => 'required|boolean',
            'inscripciones.*.existeTutor' => 'sometimes|boolean',
            'inscripciones.*.tutorArea' => 'required_if:inscripciones.*.existeTutor,true|array',
            'inscripciones.*.tutorArea.nombre' => 'required_if:inscripciones.*.existeTutor,true|string|max:255',
            'inscripciones.*.tutorArea.apellido' => 'required_if:inscripciones.*.existeTutor,true|string|max:255',
            'inscripciones.*.tutorArea.carnet_identidad' => 'required_if:inscripciones.*.existeTutor,true|string|max:20',
            'inscripciones.*.tutorArea.correo_electronico' => 'nullable|email|max:255',
            'inscripciones.*.tutorArea.tipo_tutor' => 'required_if:inscripciones.*.existeTutor,true|string|max:100',
            'inscripciones.*.tutorArea.telefono' => 'required_if:inscripciones.*.existeTutor,true|string|max:20',

            'idOlimpiada' => 'required|integer|exists:olimpiadas,idOlimpiada',
            // 'codigoInscripcion' => 'sometimes|string|max:10'
        ];
    }

    /**
     * Obtener los mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'olimpista.required' => 'Los datos del olimpista son obligatorios.',
            'responsable.required' => 'Los datos del tutor responsable son obligatorios.',
            'tutor_legal.required' => 'Los datos del tutor legal son obligatorios.',
            'inscripciones.required' => 'Debe incluir al menos una inscripción.',
            'inscripciones.min' => 'Debe incluir al menos una inscripción.',
            'inscripciones.*.area.required' => 'El área es obligatoria para cada inscripción.',
            'inscripciones.*.categoria.required' => 'La categoría es obligatoria para cada inscripción.',
            'inscripciones.*.formaInscripcion.required' => 'La forma de inscripción es obligatoria.',
            'idOlimpiada.required' => 'El ID de la olimpiada es obligatorio.',
            'idOlimpiada.exists' => 'La olimpiada seleccionada no existe.',
        ];
    }

    /**
     * Obtener los atributos personalizados.
     */
    public function attributes(): array
    {
        return [
            'olimpista.nombre' => 'nombre del olimpista',
            'olimpista.apellido' => 'apellido del olimpista',
            'olimpista.carnet_identidad' => 'carnet de identidad del olimpista',
            'olimpista.correo_electronico' => 'correo electrónico del olimpista',
            'responsable.nombre' => 'nombre del tutor responsable',
            'responsable.apellido' => 'apellido del tutor responsable',
            'tutor_legal.nombre' => 'nombre del tutor legal',
            'tutor_legal.apellido' => 'apellido del tutor legal',
        ];
    }
}