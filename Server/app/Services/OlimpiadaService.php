<?php

namespace App\Services;

use App\Repositories\Contracts\OlimpiadaRepositoryInterface;
use Exception;

class OlimpiadaService
{
    protected $repository;

    public function __construct(OlimpiadaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllOlimpiadas(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function getOlimpiadaById(int $id)
    {
        return $this->repository->find($id);
    }

    public function createOlimpiada(array $data)
    {
        // Validar nombre y versión únicos
        if ($this->repository->findByNameAndVersion($data['nombreOlimpiada'], $data['version'])) {
            throw new \InvalidArgumentException('Ya existe una olimpiada con ese nombre y versión');
        }

        // Establecer valores por defecto
        $data['estadoOlimpiada'] = $data['estadoOlimpiada'] ?? false;
        $data['idUsuario'] = $data['idUsuario'] ?? auth()->id();

        try {
            return $this->repository->create($data);
        } catch (Exception $e) {
            throw new \InvalidArgumentException($e->getMessage());
        }
    }

    public function updateOlimpiada(int $id, array $data)
    {
        // Validar nombre y versión únicos excluyendo el actual
        $existing = $this->repository->findByNameAndVersion($data['nombreOlimpiada'], $data['version']);
        if ($existing && $existing->idOlimpiada != $id) {
            throw new \InvalidArgumentException('Ya existe una olimpiada con ese nombre y versión');
        }

        try {
            return $this->repository->update($id, $data);
        } catch (Exception $e) {
            throw new \InvalidArgumentException($e->getMessage());
        }
    }

    public function deleteOlimpiada(int $id)
    {
        return $this->repository->delete($id);
    }

    public function changeOlimpiadaStatus(int $id, bool $status)
    {
        return $this->repository->changeStatus($id, $status);
    }
}