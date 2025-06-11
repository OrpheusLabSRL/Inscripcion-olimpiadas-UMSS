<?php

namespace App\Services;

use App\Repositories\Contracts\GradoRepositoryInterface;
use Illuminate\Support\Facades\Validator;

class GradoService
{
    protected $repository;

    public function __construct(GradoRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllGrados()
    {
        return $this->repository->getAll();
    }

    public function getGrado($id)
    {
        return $this->repository->getById($id);
    }

    public function createGrado(array $data)
    {
        $validator = Validator::make($data, [
            'numeroGrado' => 'required|integer',
            'nivel' => 'required|string|max:10',
            'estadoGrado' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first(), 400);
        }

        return $this->repository->create($data);
    }

    public function updateGrado($id, array $data)
    {
        $validator = Validator::make($data, [
            'numeroGrado' => 'required|integer',
            'nivel' => 'required|string|max:10',
            'estadoGrado' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first(), 400);
        }

        return $this->repository->update($id, $data);
    }

    public function deleteGrado($id)
    {
        return $this->repository->delete($id);
    }
}