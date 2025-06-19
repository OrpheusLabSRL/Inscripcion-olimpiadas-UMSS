<?php

namespace App\Repositories\Contracts;

use App\Models\Olimpista;

interface OlimpistaRepositoryInterface
{
    public function getAllWithDetails();
    public function actualizarOCrear(array $criterios, array $datos): Olimpista;
    public function buscarPorId(int $id): ?Olimpista;
    public function buscarPorPersona(int $idPersona): ?Olimpista;
    public function crear(array $datos): Olimpista;
    public function actualizar(int $id, array $datos): bool;
}
