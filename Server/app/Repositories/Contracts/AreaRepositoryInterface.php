<?php

namespace App\Repositories\Contracts;

interface AreaRepositoryInterface
{
    public function getAll($filters = []);
    public function getById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getActiveWithRelations($relations);
    public function changeStatus($id, $status);
}