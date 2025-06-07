<?php

namespace App\Repositories\Eloquent;

use App\Models\Olimpiada;
use App\Repositories\Contracts\OlimpiadaRepositoryInterface;
use Exception;

class OlimpiadaRepository implements OlimpiadaRepositoryInterface
{
    protected $model;

    public function __construct(Olimpiada $model)
    {
        $this->model = $model;
    }

    public function all(array $filters = [])
    {
        $query = $this->model->newQuery();

        if (!empty($filters['activas'])) {
            $query->activas();
        }

        if (!empty($filters['nombre'])) {
            $query->porNombre($filters['nombre']);
        }

        return $query->get();
    }

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        // Validar fechas
        if ($data['fechaFinOlimpiada'] <= $data['fechaInicioOlimpiada']) {
            throw new Exception("La fecha de fin debe ser mayor que la fecha de inicio.");
        }

        // Validar usuario
        if (empty($data['idUsuario'])) {
            throw new Exception("El campo idUsuario es requerido.");
        }

        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $olimpiada = $this->find($id);

        // Validar fechas si se están actualizando
        if (isset($data['fechaInicioOlimpiada']) && isset($data['fechaFinOlimpiada'])) {
            if ($data['fechaFinOlimpiada'] <= $data['fechaInicioOlimpiada']) {
                throw new Exception("La fecha de fin debe ser mayor que la fecha de inicio.");
            }
        }

        $olimpiada->update($data);
        return $olimpiada;
    }

    public function delete(int $id)
    {
        $olimpiada = $this->find($id);
        return $olimpiada->delete();
    }

    public function changeStatus(int $id, bool $status)
    {
        $olimpiada = $this->find($id);
        $olimpiada->estadoOlimpiada = $status;
        $olimpiada->save();
        return $olimpiada;
    }

    public function findByNameAndVersion(string $name, int $version)
    {
        return $this->model
            ->where('nombreOlimpiada', $name)
            ->where('version', $version)
            ->first();
    }
}