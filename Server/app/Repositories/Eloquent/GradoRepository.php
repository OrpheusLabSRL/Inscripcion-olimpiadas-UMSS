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
        return $this->model->create([
            'numeroGrado' => $data['numeroGrado'],
            'nivel' => $data['nivel'],
            'estadoGrado' => $data['estadoGrado']
        ]);
    }

    public function update($id, array $data)
    {
        $grado = $this->getById($id);
        if ($grado) {
            $grado->update([
                'numeroGrado' => $data['numeroGrado'],
                'nivel' => $data['nivel'],
                'estadoGrado' => $data['estadoGrado']
            ]);
        }
        return $grado;
    }

    public function delete($id)
    {
        $grado = $this->getById($id);
        if ($grado) {
            return $grado->delete();
        }
        return false;
    }
}