<?php

namespace App\Repositories\Contracts;

use App\Models\Tutor;

interface TutorRepositoryInterface
{
    public function getAllWithDetails();
    public function actualizarOCrear(array $criterios, array $datos): Tutor;
    public function buscarPorId(int $id): ?Tutor;
    public function buscarPorPersona(int $idPersona): ?Tutor;
    public function crear(array $datos): Tutor;
    public function actualizar(int $id, array $datos): bool;
}
