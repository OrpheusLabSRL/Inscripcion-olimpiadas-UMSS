<?php

namespace App\Repositories\Eloquent;

use App\Models\Area;
use App\Repositories\Contracts\AreaRepositoryInterface;

class AreaRepository implements AreaRepositoryInterface
{
    protected $model;

    public function __construct(Area $model)
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
        $area = $this->getById($id);
        $area->update($data);
        return $area;
    }

    public function delete($id)
    {
        $area = $this->getById($id);
        return $area->delete();
    }

    public function getActiveWithRelations($relations, $idOlimpiada = null)
{
    $query = $this->model->where('estadoArea', true);
    if ($idOlimpiada) {
        $query->whereHas('categorias', function ($q) use ($idOlimpiada) {
            $q->where('estadoCategoria', true)
                ->where('olimpiadas_areas_categorias.idOlimpiada', $idOlimpiada)
                ->where('olimpiadas_areas_categorias.estado', true);
        });
    }
    
    return $query->with($relations)->get();
}

    public function changeStatus($id, $status)
    {
        $area = $this->getById($id);
        $area->estadoArea = $status;
        $area->save();
        return $area;
    }
}