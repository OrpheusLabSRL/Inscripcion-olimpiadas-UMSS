<?php

namespace App\Repositories\Eloquent;
use App\Models\Persona;
use App\Repositories\Contracts\PersonaRepositoryInterface;

class PersonaRepository implements PersonaRepositoryInterface
{
    /**
     * Actualizar o crear persona
     */
    public function actualizarOCrear(array $criterios, array $datos): Persona
    {
        return Persona::updateOrCreate($criterios, $datos);
    }

    /**
     * Buscar persona por carnet de identidad
     */
    public function buscarPorCarnet(string $carnetIdentidad): ?Persona
    {
        return Persona::where('carnetIdentidad', $carnetIdentidad)->first();
    }

    /**
     * Buscar persona por carnet y correo
     */
    public function buscarPorCarnetYCorreo(string $carnetIdentidad, string $correoElectronico): ?Persona
    {
        return Persona::where('carnetIdentidad', $carnetIdentidad)
            ->where('correoElectronico', $correoElectronico)
            ->first();
    }

    /**
     * Buscar persona por ID
     */
    public function buscarPorId(int $id): ?Persona
    {
        return Persona::find($id);
    }

    /**
     * Crear nueva persona
     */
    public function crear(array $datos): Persona
    {
        return Persona::create($datos);
    }

    /**
     * Actualizar persona
     */
    public function actualizar(int $id, array $datos): bool
    {
        return Persona::where('idPersona', $id)->update($datos);
    }

    /**
     * Eliminar persona
     */
    public function eliminar(int $id): bool
    {
        return Persona::where('idPersona', $id)->delete();
    }
}