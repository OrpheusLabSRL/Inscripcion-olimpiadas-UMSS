<?php

namespace App\Services;

use App\Repositories\Contracts\OlimpiadaAreaCategoriaRepositoryInterface;
use Illuminate\Support\Facades\Validator;

class OlimpiadaAreaCategoriaService
{
    protected $repository;

    public function __construct(OlimpiadaAreaCategoriaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllCombinations()
    {
        return $this->repository->getAllWithRelations();
    }

    public function createCombinations(array $data)
    {
        $validator = Validator::make($data, [
            'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada',
            'idArea' => 'required|exists:areas,idArea',
            'idCategoria' => 'required|exists:categorias,idCategoria',
            'costo' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first(), 422);
        }

        return $this->repository->createOrUpdate($data);
    }

    public function deleteCombination($id)
    {
        return $this->repository->delete($id);
    }

    public function getByOlimpiadaGrouped($idOlimpiada)
    {
        $combinaciones = $this->repository->getByOlimpiada($idOlimpiada);

        $resultados = [];
        foreach ($combinaciones as $idArea => $grupo) {
            $area = $grupo->first()->area;

            $categorias = $grupo->map(function ($combinacion) {
                $cat = $combinacion->categoria;
                return [
                    'idCategoria' => $cat->idCategoria,
                    'nombreCategoria' => $cat->nombreCategoria,
                    'costo' => $combinacion->costo,
                    'grados' => $cat->grados->map(function ($grado) {
                        return [
                            'idGrado' => $grado->idGrado,
                            'numeroGrado' => $grado->numeroGrado,
                            'nivel' => $grado->nivel,
                        ];
                    })
                ];
            });

            $resultados[] = [
                'idArea' => $area->idArea,
                'nombreArea' => $area->nombreArea,
                'descripcionArea' => $area->descripcionArea,
                'categorias' => $categorias,
            ];
        }

        return $resultados;
    }

    public function deleteByOlimpiadaAndArea($idOlimpiada, $idArea)
    {
        return $this->repository->deleteByOlimpiadaAndArea($idOlimpiada, $idArea);
    }
}