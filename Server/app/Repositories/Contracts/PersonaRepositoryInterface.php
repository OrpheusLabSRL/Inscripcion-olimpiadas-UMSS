<?php

namespace App\Repositories\Contracts;

use App\Models\Persona;

interface PersonaRepositoryInterface
{
    /**
     * Actualizar o crear persona
     */
    public function actualizarOCrear(array $criterios, array $datos): Persona;

    /**
     * Buscar persona por carnet de identidad
     */
    public function buscarPorCarnet(string $carnetIdentidad): ?Persona;

    /**
     * Buscar persona por carnet y correo
     */
    public function buscarPorCarnetYCorreo(string $carnetIdentidad, string $correoElectronico): ?Persona;

    /**
     * Buscar persona por ID
     */
    public function buscarPorId(int $id): ?Persona;

    /**
     * Crear nueva persona
     */
    public function crear(array $datos): Persona;

    /**
     * Actualizar persona
     */
    public function actualizar(int $id, array $datos): bool;

    /**
     * Eliminar persona
     */
    public function eliminar(int $id): bool;
}