<?php

namespace App\Repositories\Contracts;

interface OlimpiadaAreaCategoriaRepositoryInterface
{
    public function getAllWithRelations();
    public function createOrUpdate(array $data);
    public function delete($id);
    public function getByOlimpiada($idOlimpiada);
    public function deleteByOlimpiadaAndArea($idOlimpiada, $idArea);
    public function find($id);
}