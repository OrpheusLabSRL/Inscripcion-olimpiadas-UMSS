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

    public function getAllWithAreasCategorias()
    {
        return $this->model
            ->select(
                'olimpiadas.*',
                'areas.nombreArea',
                'categorias.nombreCategoria'
            )
            ->join('olimpiadas_areas_categorias', 'olimpiadas.idOlimpiada', '=', 'olimpiadas_areas_categorias.idOlimpiada')
            ->join('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
            ->join('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
            ->where('olimpiadas_areas_categorias.estado', 1)
            ->get();
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