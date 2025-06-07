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

    public function all(array $filters = [])
    {
        $query = $this->model->newQuery();

        if (!empty($filters['activas'])) {
            $query->activas();
        }

        if (!empty($filters['nombre'])) {
            $query->porNombre($filters['nombre']);
        }

        return $query->get();
    }

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $categoria = $this->find($id);
        $categoria->update($data);
        return $categoria;
    }

    public function delete(int $id)
    {
        $categoria = $this->find($id);
        return $categoria->delete();
    }

    public function findByName(string $name)
    {
        return $this->model->where('nombreCategoria', $name)->first();
    }
}