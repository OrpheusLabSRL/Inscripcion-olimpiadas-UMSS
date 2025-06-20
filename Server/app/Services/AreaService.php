<?php

namespace App\Services;

use App\Repositories\Contracts\AreaRepositoryInterface;

class AreaService
{
    protected $repository;

    public function __construct(AreaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllAreas()
    {
        return $this->repository->getAll();
    }

    public function createArea(array $data)
    {
        $defaultData = [
            'estadoArea' => $data['estadoArea'] ?? true
        ];
        
        return $this->repository->create(array_merge($data, $defaultData));
    }

    public function updateArea($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteArea($id)
    {
        return $this->repository->delete($id);
    }

    public function changeAreaStatus($id, $status)
    {
        return $this->repository->changeStatus($id, $status);
    }

    public function getProgramaCompleto($id)
    {
        $areas = $this->repository->getActiveWithRelations([
        'categorias' => function ($query) use ($id) {
            $query->where('estadoCategoria', true)
                ->where('olimpiadas_areas_categorias.idOlimpiada', $id)
                ->where('olimpiadas_areas_categorias.estado', true)
                ->with(['grados' => function ($q) {
                    $q->where('estadoGrado', true);
                }]);
        }
        ], $id);

        $programa = [];

        foreach ($areas as $area) {
            foreach ($area->categorias as $categoria) {
                $grados = $categoria->grados;

                if ($grados->count() > 0) {
                    $gradosOrdenados = $grados->sortBy('numeroGrado')->values();
                    $primero = $gradosOrdenados->first();
                    $ultimo = $gradosOrdenados->last();
                    $mismoNivel = $gradosOrdenados->every(fn($g) => $g->nivel === $primero->nivel);

                    if ($gradosOrdenados->count() === 1) {
                        $gradoFormateado = $this->formatearGrado($primero->numeroGrado, $primero->nivel);
                    } elseif ($mismoNivel) {
                        $gradoFormateado = "{$primero->numeroGrado}° a {$ultimo->numeroGrado}° {$primero->nivel}";
                    } else {
                        $gradoFormateado = $gradosOrdenados->map(function ($g) {
                            return $this->formatearGrado($g->numeroGrado, $g->nivel);
                        })->implode(' / ');
                    }

                    $programa[] = [
                        'area' => $area->nombreArea,
                        'nivel' => $categoria->nombreCategoria,
                        'grados' => $gradoFormateado,
                        'area_id' => $area->idArea,
                        'categoria_id' => $categoria->idCategoria,
                        'costo' => $categoria->pivot->costo,
                    ];
                }
            }
        }

        return $programa;
    }

    private function formatearGrado($numero, $nivel)
    {
        $simbolo = is_numeric($numero) ? "{$numero}°" : $numero;
        return "{$simbolo} {$nivel}";
    }
}