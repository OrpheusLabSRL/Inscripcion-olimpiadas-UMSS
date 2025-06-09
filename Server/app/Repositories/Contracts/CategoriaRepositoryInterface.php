<?php

namespace App\Repositories\Contracts;

interface CategoriaRepositoryInterface
{
    public function getAll();
    public function getById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function checkNameExists($name, $excludeId = null);
}