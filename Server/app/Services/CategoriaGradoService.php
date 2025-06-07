<?php

namespace App\Services;

use App\Repositories\Contracts\CategoriaGradoRepositoryInterface;
use App\Repositories\Contracts\CategoriaRepositoryInterface;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CategoriaGradoService
{
    protected $categoriaGradoRepository;
    protected $categoriaRepository;

    public function __construct(
        CategoriaGradoRepositoryInterface $categoriaGradoRepository,
        CategoriaRepositoryInterface $categoriaRepository
    ) {
        $this->categoriaGradoRepository = $categoriaGradoRepository;
        $this->categoriaRepository = $categoriaRepository;
    }

    public function getAllRelations()
    {
        return $this->categoriaGradoRepository->allWithRelations();
    }

    public function getRelationById(int $id)
    {
        return $this->categoriaGradoRepository->find($id);
    }

    public function createRelation(array $data)
    {
        $this->validateRelationData($data);

        if ($this->categoriaGradoRepository->exists($data['idCategoria'], $data['idGrado'])) {
            throw new \InvalidArgumentException('Ya existe una relación entre esta categoría y grado');
        }

        return $this->categoriaGradoRepository->create([
            'idCategoria' => $data['idCategoria'],
            'idGrado' => $data['idGrado'],
            'estadoCategoriaGrado' => $data['estadoCategoriaGrado'] ?? true
        ]);
    }

    public function updateRelation(int $id, array $data)
    {
        $this->validateRelationData($data);

        $existing = $this->categoriaGradoRepository->exists($data['idCategoria'], $data['idGrado']);
        if ($existing) {
            $relation = $this->categoriaGradoRepository->find($id);
            if ($relation->idCategoria != $data['idCategoria'] || $relation->idGrado != $data['idGrado']) {
                throw new \InvalidArgumentException('Ya existe una relación entre esta categoría y grado');
            }
        }

        return $this->categoriaGradoRepository->update($id, $data);
    }

    public function deleteRelation(int $id)
    {
        return $this->categoriaGradoRepository->delete($id);
    }

    public function changeRelationStatus(int $id, bool $status)
    {
        return $this->categoriaGradoRepository->changeStatus($id, $status);
    }

    public function updateCategoriaAndGrados(int $idCategoria, array $data)
    {
        $this->validateUpdateCategoriaData($data);

        return DB::transaction(function () use ($idCategoria, $data) {
            // Actualizar categoría
            $this->categoriaRepository->update($idCategoria, [
                'nombreCategoria' => $data['nombreCategoria']
            ]);

            // Sincronizar grados
            $estado = $data['estadoCategoriaGrado'] ?? true;
            $this->categoriaGradoRepository->syncCategoriaGrados(
                $idCategoria,
                $data['grados'],
                $estado
            );

            return $this->categoriaRepository->find($idCategoria);
        });
    }

    protected function validateRelationData(array $data)
    {
        $validator = Validator::make($data, [
            'idCategoria' => 'required|exists:categorias,idCategoria',
            'idGrado' => 'required|exists:grados,idGrado',
            'estadoCategoriaGrado' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    protected function validateUpdateCategoriaData(array $data)
    {
        $validator = Validator::make($data, [
            'nombreCategoria' => 'required|string|max:255',
            'grados' => 'required|array',
            'grados.*' => 'exists:grados,idGrado',
            'estadoCategoriaGrado' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}