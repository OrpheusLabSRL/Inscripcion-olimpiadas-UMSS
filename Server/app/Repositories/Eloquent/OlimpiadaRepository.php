<?php

namespace App\Repositories\Eloquent;

use App\Models\Olimpiada;
use App\Repositories\Contracts\OlimpiadaRepositoryInterface;

class OlimpiadaRepository implements OlimpiadaRepositoryInterface
{
    protected $model;

    public function __construct(Olimpiada $model)
    {
        $this->model = $model;
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $olimpiada = $this->getById($id);
        $olimpiada->update($data);
        return $olimpiada;
    }

    public function delete($id)
    {
        $olimpiada = $this->getById($id);
        return $olimpiada->delete();
    }

    public function changeStatus($id, $status)
    {
        $olimpiada = $this->getById($id);
        $olimpiada->estadoOlimpiada = $status;
        $olimpiada->save();
        return $olimpiada;
    }
}