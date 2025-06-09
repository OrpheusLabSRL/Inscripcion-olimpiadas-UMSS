<?php

namespace App\Repositories\Eloquent;

use App\Models\Categoria;
use App\Repositories\Contracts\CategoriaRepositoryInterface;

class CategoriaRepository implements CategoriaRepositoryInterface
{
    protected $model;

    public function __construct(Categoria $model)
    {
        $this->model = $model;
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $categoria = $this->getById($id);
        if ($categoria) {
            $categoria->update($data);
        }
        return $categoria;
    }

    public function delete($id)
    {
        $categoria = $this->getById($id);
        if ($categoria) {
            return $categoria->delete();
        }
        return false;
    }

    public function checkNameExists($name, $excludeId = null)
    {
        $query = $this->model->where('nombreCategoria', $name);
        if ($excludeId) {
            $query->where('idCategoria', '!=', $excludeId);
        }
        return $query->exists();
    }
}