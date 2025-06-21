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
            $query->porEstado($filters['estado']);
        } else {
            $query->activas();
        }
        
        return $query->get();
    }

    public function getProgramaCompleto($olimpiadaId)
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

    // Implementar otros métodos de la interfaz...
}