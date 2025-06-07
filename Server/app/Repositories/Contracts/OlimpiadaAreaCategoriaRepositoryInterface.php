<?php

namespace App\Repositories\Contracts;

interface OlimpiadaAreaCategoriaRepositoryInterface
{
    public function allWithRelations();
    public function createOrUpdate(array $data);
    public function delete(int $id);
    public function getByOlimpiada(int $idOlimpiada);
    public function deleteByOlimpiadaAndArea(int $idOlimpiada, int $idArea);
    public function exists(int $idOlimpiada, int $idArea, int $idCategoria);
}