<?php

namespace App\Repositories\Eloquent;

use App\Models\CategoriaGrado;
use App\Repositories\Contracts\CategoriaGradoRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CategoriaGradoRepository implements CategoriaGradoRepositoryInterface
{
    protected $model;

    public function __construct(CategoriaGrado $model)
    {
        $this->model = $model;
    }

    public function getAllWithRelations()
    {
        return $this->model->with(['categoria', 'grado'])->get();
    }

    public function findOrFail($id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $relacion = $this->findOrFail($id);
        $relacion->update($data);
        return $relacion;
    }

    public function delete($id)
    {
        $relacion = $this->findOrFail($id);
        return $relacion->delete();
    }

    public function updateStatus($id, $status)
    {
        $relacion = $this->findOrFail($id);
        $relacion->update(['estadoCategoriaGrado' => $status]);
        return $relacion;
    }

    public function syncGrados($categoriaId, array $grados, $estado = true)
    {
        $syncData = [];
        foreach ($grados as $gradoId) {
            $syncData[$gradoId] = ['estadoCategoriaGrado' => $estado];
        }

        return DB::transaction(function () use ($categoriaId, $syncData) {
            // Primero eliminamos las relaciones existentes
            $this->model->where('categoria_id', $categoriaId)->delete();
            
            // Luego creamos las nuevas relaciones
            $insertData = [];
            foreach ($syncData as $gradoId => $data) {
                $insertData[] = [
                    'categoria_id' => $categoriaId,
                    'grado_id' => $gradoId,
                    'estadoCategoriaGrado' => $data['estadoCategoriaGrado']
                ];
            }
            
            return $this->model->insert($insertData);
        });
    }
}