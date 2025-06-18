<?php

namespace App\Services;

use App\Repositories\Contracts\TutorRepositoryInterface;

class TutorService
{
    protected $repository;

    public function __construct(TutorRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllTutorsWithDetails()
    {
        return $this->repository->getAllWithDetails();
    }
}
