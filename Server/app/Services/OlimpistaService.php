<?php

namespace App\Services;

use App\Repositories\Contracts\OlimpistaRepositoryInterface;

class OlimpistaService
{
    protected $repository;

    public function __construct(OlimpistaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllOlimpistasWithDetails()
    {
        return $this->repository->getAllWithDetails();
    }

    public function getOlympiadRegistrationsReport()
    {
        return $this->repository->getOlympiadRegistrationsReport();
    }

}
