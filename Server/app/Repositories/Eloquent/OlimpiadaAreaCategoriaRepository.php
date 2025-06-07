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

    public function allWithRelations()
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

    public function delete(int $id)
    {
        $item = $this->model->findOrFail($id);
        return $item->delete();
    }

    public function getByOlimpiada(int $idOlimpiada)
    {
        return $this->model->porOlimpiada($idOlimpiada)
            ->with(['area', 'categoria.grados'])
            ->get()
            ->groupBy('idArea');
    }

    public function deleteByOlimpiadaAndArea(int $idOlimpiada, int $idArea)
    {
        return $this->model->porOlimpiada($idOlimpiada)
            ->porArea($idArea)
            ->delete();
    }

    public function exists(int $idOlimpiada, int $idArea, int $idCategoria)
    {
        return $this->model->where([
            'idOlimpiada' => $idOlimpiada,
            'idArea' => $idArea,
            'idCategoria' => $idCategoria
        ])->exists();
    }
}