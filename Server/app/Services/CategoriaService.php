<?php

namespace App\Services;

use App\Repositories\Contracts\CategoriaRepositoryInterface;

class CategoriaService
{
    protected $repository;

    public function __construct(CategoriaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllCategorias(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function getCategoriaById(int $id)
    {
        return $this->repository->find($id);
    }

    public function createCategoria(array $data)
    {
        // Validar nombre único
        if ($this->repository->findByName($data['nombreCategoria'])) {
            throw new \InvalidArgumentException('El nombre de categoría ya existe');
        }

        return $this->repository->create([
            'nombreCategoria' => $data['nombreCategoria'],
            'estadoCategoria' => $data['estadoCategoria'] ?? true
        ]);
    }

    public function updateCategoria(int $id, array $data)
    {
        $categoria = $this->repository->find($id);

        // Validar nombre único excluyendo el actual
        $existing = $this->repository->findByName($data['nombreCategoria']);
        if ($existing && $existing->idCategoria != $id) {
            throw new \InvalidArgumentException('El nombre de categoría ya existe');
        }

        return $this->repository->update($id, [
            'nombreCategoria' => $data['nombreCategoria'],
            'estadoCategoria' => $data['estadoCategoria']
        ]);
    }

    public function deleteCategoria(int $id)
    {
        return $this->repository->delete($id);
    }
}