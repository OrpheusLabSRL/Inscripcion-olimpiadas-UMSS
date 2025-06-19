<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsultaInscripcionRequest extends FormRequest
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
            'carnetIdentidad' => 'required|string|max:20',
            'correoElectronico' => 'required|email|max:255',
            'rol' => 'required|in:olimpista,tutor'
        ];
    }

    /**
     * Obtener los mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'carnetIdentidad.required' => 'El carnet de identidad es obligatorio.',
            'correoElectronico.required' => 'El correo electrónico es obligatorio.',
            'correoElectronico.email' => 'El correo electrónico debe ser una dirección válida.',
            'rol.required' => 'El rol es obligatorio.',
            'rol.in' => 'El rol debe ser olimpista o tutor.',
        ];
    }

    /**
     * Obtener los atributos personalizados.
     */
    public function attributes(): array
    {
        return [
            'carnetIdentidad' => 'carnet de identidad',
            'correoElectronico' => 'correo electrónico',
            'rol' => 'rol'
        ];
    }
}