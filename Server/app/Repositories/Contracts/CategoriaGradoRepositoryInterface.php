<?php

namespace App\Repositories\Contracts;

interface CategoriaGradoRepositoryInterface
{
    public function allWithRelations();
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function changeStatus(int $id, bool $status);
    public function syncCategoriaGrados(int $idCategoria, array $grados, bool $estado);
    public function exists(int $idCategoria, int $idGrado);
}