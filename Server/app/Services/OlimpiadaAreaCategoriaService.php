<?php

namespace App\Services;

use App\Repositories\Contracts\OlimpiadaAreaCategoriaRepositoryInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class OlimpiadaAreaCategoriaService
{
    protected $repository;

    public function __construct(OlimpiadaAreaCategoriaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllCombinations()
    {
        return $this->repository->allWithRelations();
    }

    public function createOrUpdateCombinations(array $items)
    {
        $results = [];
        $errors = [];

        foreach ($items as $index => $item) {
            try {
                $this->validateCombination($item);
                
                if ($this->repository->exists($item['idOlimpiada'], $item['idArea'], $item['idCategoria'])) {
                    throw new \InvalidArgumentException('La combinación ya existe');
                }

                $results[] = $this->repository->createOrUpdate($item);
            } catch (ValidationException $e) {
                $errors[$index] = $e->errors();
            } catch (\Exception $e) {
                $errors[$index] = $e->getMessage();
            }
        }

        if (!empty($errors)) {
            throw new \InvalidArgumentException(json_encode($errors));
        }

        return $results;
    }

    public function deleteCombination(int $id)
    {
        return $this->repository->delete($id);
    }

    public function getByOlimpiadaGrouped(int $idOlimpiada)
    {
        $grouped = $this->repository->getByOlimpiada($idOlimpiada);
        
        return $grouped->map(function ($items, $idArea) {
            $area = $items->first()->area;
            
            $categorias = $items->map(function ($combinacion) {
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

            return [
                'idArea' => $area->idArea,
                'nombreArea' => $area->nombreArea,
                'descripcionArea' => $area->descripcionArea,
                'categorias' => $categorias,
            ];
        })->values();
    }

    public function deleteByOlimpiadaAndArea(int $idOlimpiada, int $idArea)
    {
        return $this->repository->deleteByOlimpiadaAndArea($idOlimpiada, $idArea);
    }

    protected function validateCombination(array $data)
    {
        $validator = Validator::make($data, [
            'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada',
            'idArea' => 'required|exists:areas,idArea',
            'idCategoria' => 'required|exists:categorias,idCategoria',
            'costo' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}