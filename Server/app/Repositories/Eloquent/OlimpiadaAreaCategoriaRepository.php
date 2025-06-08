<?php

namespace App\Repositories\Eloquent;

use App\Models\OlimpiadaAreaCategoria;
use App\Repositories\Contracts\OlimpiadaAreaCategoriaRepositoryInterface;

class OlimpiadaAreaCategoriaRepository implements OlimpiadaAreaCategoriaRepositoryInterface
{
    protected $model;

    public function __construct(OlimpiadaAreaCategoria $model)
    {
        $this->model = $model;
    }

    public function getAllWithRelations()
    {
        return $this->model->with(['olimpiada', 'area', 'categoria'])->get();
    }

    public function createOrUpdate(array $data)
    {
        return $this->model->firstOrCreate(
            [
                'idOlimpiada' => $data['idOlimpiada'],
                'idArea' => $data['idArea'],
                'idCategoria' => $data['idCategoria'],
            ],
            [
                'estado' => true,
                'costo' => $data['costo'],
            ]
        );
    }

    public function delete($id)
    {
        $item = $this->model->findOrFail($id);
        return $item->delete();
    }

    public function getByOlimpiada($idOlimpiada)
    {
        return $this->model->where('idOlimpiada', $idOlimpiada)
            ->with(['area', 'categoria.grados'])
            ->get()
            ->groupBy('idArea');
    }

    public function deleteByOlimpiadaAndArea($idOlimpiada, $idArea)
    {
        return $this->model->where('idOlimpiada', $idOlimpiada)
            ->where('idArea', $idArea)
            ->delete();
    }

    public function find($id)
    {
        return $this->model->findOrFail($id);
    }
}