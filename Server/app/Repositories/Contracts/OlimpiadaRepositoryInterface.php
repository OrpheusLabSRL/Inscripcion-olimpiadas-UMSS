<?php

namespace App\Repositories\Contracts;

interface OlimpiadaRepositoryInterface
{
    public function all(array $filters = []);
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function changeStatus(int $id, bool $status);
    public function findByNameAndVersion(string $name, int $version);
}