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