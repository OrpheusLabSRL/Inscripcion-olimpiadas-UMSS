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

    public function allWithRelations()
    {
        return $this->model->with(['categoria', 'grado'])->get();
    }

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $relacion = $this->find($id);
        $relacion->update($data);
        return $relacion;
    }

    public function delete(int $id)
    {
        $relacion = $this->find($id);
        return $relacion->delete();
    }

    public function changeStatus(int $id, bool $status)
    {
        $relacion = $this->find($id);
        $relacion->estadoCategoriaGrado = $status;
        $relacion->save();
        return $relacion;
    }

    public function syncCategoriaGrados(int $idCategoria, array $grados, bool $estado)
    {
        $syncData = [];
        foreach ($grados as $gradoId) {
            $syncData[$gradoId] = ['estadoCategoriaGrado' => $estado];
        }

        return DB::transaction(function () use ($idCategoria, $syncData) {
            return $this->model->where('idCategoria', $idCategoria)
                ->whereNotIn('idGrado', array_keys($syncData))
                ->delete();

            foreach ($syncData as $gradoId => $data) {
                $this->model->updateOrCreate(
                    ['idCategoria' => $idCategoria, 'idGrado' => $gradoId],
                    $data
                );
            }

            return true;
        });
    }

    public function exists(int $idCategoria, int $idGrado)
    {
        return $this->model->where([
            'idCategoria' => $idCategoria,
            'idGrado' => $idGrado
        ])->exists();
    }
}