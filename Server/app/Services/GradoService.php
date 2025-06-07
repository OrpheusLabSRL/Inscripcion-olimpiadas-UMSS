<?php

namespace App\Services;

use App\Repositories\Contracts\GradoRepositoryInterface;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class GradoService
{
    protected $repository;

    public function __construct(GradoRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllGrados(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function getGradoById(int $id)
    {
        return $this->repository->find($id);
    }

    public function createGrado(array $data)
    {
        $this->validateGradoData($data);

        if ($this->repository->exists($data['numeroGrado'], $data['nivel'])) {
            throw new \InvalidArgumentException('Ya existe un grado con ese número y nivel');
        }

        return $this->repository->create([
            'numeroGrado' => $data['numeroGrado'],
            'nivel' => $data['nivel'],
            'estadoGrado' => $data['estadoGrado'] ?? true
        ]);
    }

    public function updateGrado(int $id, array $data)
    {
        $this->validateGradoData($data);

        $existing = $this->repository->exists($data['numeroGrado'], $data['nivel']);
        if ($existing) {
            $grado = $this->repository->find($id);
            if ($grado->numeroGrado != $data['numeroGrado'] || $grado->nivel != $data['nivel']) {
                throw new \InvalidArgumentException('Ya existe un grado con ese número y nivel');
            }
        }

        return $this->repository->update($id, $data);
    }

    public function deleteGrado(int $id)
    {
        return $this->repository->delete($id);
    }

    protected function validateGradoData(array $data)
    {
        $validator = Validator::make($data, [
            'numeroGrado' => 'required|integer',
            'nivel' => 'required|string|max:10',
            'estadoGrado' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}