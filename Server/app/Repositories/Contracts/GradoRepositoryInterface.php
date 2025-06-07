<?php

namespace App\Repositories\Contracts;

interface GradoRepositoryInterface
{
    public function all(array $filters = []);
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function exists(int $numeroGrado, string $nivel);
}