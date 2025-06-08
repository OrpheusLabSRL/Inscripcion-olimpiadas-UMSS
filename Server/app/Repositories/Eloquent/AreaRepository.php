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

    public function getAll($filters = [])
    {
        $query = $this->model->newQuery();

        if (isset($filters['estado'])) {
            if ($filters['estado'] === 'true' || $filters['estado'] === '1') {
                $query->where('estadoArea', true);
            } elseif ($filters['estado'] === 'false' || $filters['estado'] === '0') {
                $query->where('estadoArea', false);
            }
        } else {
            $query->where('estadoArea', true);
        }

        return $query->get();
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

    public function getActiveWithRelations($relations)
    {
        return $this->model->where('estadoArea', true)
            ->with($relations)
            ->get();
    }

    public function changeStatus($id, $status)
    {
        $area = $this->getById($id);
        $area->estadoArea = $status;
        $area->save();
        return $area;
    }
}