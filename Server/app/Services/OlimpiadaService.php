<?php

namespace App\Services;

use App\Repositories\Contracts\OlimpiadaRepositoryInterface;

class OlimpiadaService
{
    protected $repository;

    public function __construct(OlimpiadaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllOlimpiadas()
    {
        return $this->repository->getAll();
    }

    public function getAllOlimpiadasConAreasCategorias()
    {
        return $this->repository->getAllWithAreasCategorias();
    }

    public function createOlimpiada(array $data)
    {
        // Manteniendo los mismos valores por defecto
        $data['estadoOlimpiada'] = false;
        $data['idUsuario'] = 1;
        
        return $this->repository->create($data);
    }

    public function updateOlimpiada($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteOlimpiada($id)
    {
        return $this->repository->delete($id);
    }

    public function changeOlimpiadaStatus($id, $status)
    {
        return $this->repository->changeStatus($id, $status);
    }
}