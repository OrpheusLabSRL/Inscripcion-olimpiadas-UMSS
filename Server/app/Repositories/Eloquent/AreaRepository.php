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

    public function getAll(array $filters = [])
    {
        $query = $this->model->newQuery();
        
        if (isset($filters['estado'])) {
            $query->porEstado($filters['estado']);
        } else {
            $query->activas();
        }
        
        return $query->get();
    }

    public function getById(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $area = $this->getById($id);
        $area->update($data);
        return $area;
    }

    public function delete(int $id)
    {
        $area = $this->getById($id);
        return $area->delete();
    }

    public function changeStatus(int $id, bool $status)
    {
        $area = $this->getById($id);
        $area->estadoArea = $status;
        $area->save();
        return $area;
    }

    public function getProgramaCompleto(int $olimpiadaId)
    {
        return $this->model->where('estadoArea', true)
            ->whereHas('categorias', function ($query) use ($olimpiadaId) {
                $query->where('estadoCategoria', true)
                    ->where('olimpiadas_areas_categorias.idOlimpiada', $olimpiadaId)
                    ->where('olimpiadas_areas_categorias.estado', true);
            })
            ->with(['categorias' => function ($query) use ($olimpiadaId) {
                $query->where('estadoCategoria', true)
                    ->where('olimpiadas_areas_categorias.idOlimpiada', $olimpiadaId)
                    ->where('olimpiadas_areas_categorias.estado', true)
                    ->with(['grados' => function ($q) {
                        $q->where('estadoGrado', true);
                    }]);
            }])
            ->get();
    }
}