<?php

namespace App\Repositories\Eloquent;

use App\Models\Grado;
use App\Repositories\Contracts\GradoRepositoryInterface;

class GradoRepository implements GradoRepositoryInterface
{
    protected $model;

    public function __construct(Grado $model)
    {
        $this->model = $model;
    }

    public function all(array $filters = [])
    {
        $query = $this->model->newQuery();

        if (!empty($filters['activos'])) {
            $query->activos();
        }

        if (!empty($filters['nivel'])) {
            $query->porNivel($filters['nivel']);
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
        $grado = $this->find($id);
        $grado->update($data);
        return $grado;
    }

    public function delete(int $id)
    {
        $grado = $this->find($id);
        return $grado->delete();
    }

    public function exists(int $numeroGrado, string $nivel)
    {
        return $this->model->where([
            'numeroGrado' => $numeroGrado,
            'nivel' => $nivel
        ])->exists();
    }
}