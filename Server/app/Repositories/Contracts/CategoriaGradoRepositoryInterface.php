<?php

namespace App\Repositories\Contracts;

interface CategoriaGradoRepositoryInterface
{
    public function getAllWithRelations();
    public function findOrFail($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function updateStatus($id, $status);
    public function syncGrados($categoriaId, array $grados, $estado);
}