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

    public function getAllCategorias()
    {
        return $this->repository->getAll();
    }

    public function getCategoria($id)
    {
        return $this->repository->getById($id);
    }

    public function createCategoria(array $data)
    {
        if ($this->repository->checkNameExists($data['nombreCategoria'])) {
            throw new \Exception('El nombre de categoría ya existe');
        }

        return $this->repository->create($data);
    }

    public function updateCategoria($id, array $data)
    {
        if ($this->repository->checkNameExists($data['nombreCategoria'], $id)) {
            throw new \Exception('El nombre de categoría ya existe');
        }

        return $this->repository->update($id, $data);
    }

    public function deleteCategoria($id)
    {
        return $this->repository->delete($id);
    }
}