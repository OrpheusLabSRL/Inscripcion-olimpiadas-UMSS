<?php

namespace App\Repositories\Contracts;

interface AreaRepositoryInterface
{
    public function getAll(array $filters = []);
    public function getById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function changeStatus(int $id, bool $status);
    public function getProgramaCompleto(int $olimpiadaId);
}