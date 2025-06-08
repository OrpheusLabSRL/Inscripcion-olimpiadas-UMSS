<?php

namespace App\Services;

use App\Repositories\Contracts\CategoriaGradoRepositoryInterface;
use App\Repositories\Contracts\CategoriaRepositoryInterface;
use Illuminate\Support\Facades\Validator;

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
        return $this->categoriaGradoRepository->getAllWithRelations();
    }

    public function createRelation(array $data)
    {
        $validator = Validator::make($data, [
            'idCategoria' => 'required|exists:categoria,idCategoria',
            'idGrado' => 'required|exists:grado,idGrado',
            'estadoCategoriaGrado' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first(), 400);
        }

        return $this->categoriaGradoRepository->create($data);
    }

    public function updateRelation($id, array $data)
    {
        $validator = Validator::make($data, [
            'idCategoria' => 'required|exists:categoria,idCategoria',
            'idGrado' => 'required|exists:grado,idGrado',
            'estadoCategoriaGrado' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first(), 400);
        }

        return $this->categoriaGradoRepository->update($id, $data);
    }

    public function deleteRelation($id)
    {
        return $this->categoriaGradoRepository->delete($id);
    }

    public function updateRelationStatus($id, $status)
    {
        return $this->categoriaGradoRepository->updateStatus($id, $status);
    }

    public function updateCategoriaAndGrados($categoriaId, array $data)
    {
        $validator = Validator::make($data, [
            'nombreCategoria' => 'required|string|max:255',
            'grados' => 'required|array',
            'grados.*' => 'exists:grados,idGrado',
            'estadoCategoriaGrado' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first(), 400);
        }

        $estado = $data['estadoCategoriaGrado'] ?? true;
        
        // Actualizar nombre de categoría
        $this->categoriaRepository->update($categoriaId, [
            'nombreCategoria' => $data['nombreCategoria']
        ]);

        // Sincronizar grados
        return $this->categoriaGradoRepository->syncGrados(
            $categoriaId,
            $data['grados'],
            $estado
        );
    }
}