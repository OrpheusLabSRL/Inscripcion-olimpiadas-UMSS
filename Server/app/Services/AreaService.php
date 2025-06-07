<?php

namespace App\Services;

use App\Repositories\Contracts\AreaRepositoryInterface;

class AreaService
{
    protected $repository;

    public function __construct(AreaRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllAreas(array $filters = [])
    {
        return $this->repository->getAll($filters);
    }

    public function getAreaById(int $id)
    {
        return $this->repository->getById($id);
    }

    public function createArea(array $data)
    {
        $defaultData = [
            'estadoArea' => $data['estadoArea'] ?? true
        ];
        
        return $this->repository->create(array_merge($data, $defaultData));
    }

    public function updateArea(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteArea(int $id)
    {
        return $this->repository->delete($id);
    }

    public function changeAreaStatus(int $id, bool $status)
    {
        return $this->repository->changeStatus($id, $status);
    }

    public function getFormattedProgram(int $olimpiadaId)
    {
        $areas = $this->repository->getProgramaCompleto($olimpiadaId);
        
        return $areas->flatMap(function ($area) {
            return $area->categorias->map(function ($categoria) use ($area) {
                $grados = $categoria->grados;
                
                if ($grados->isEmpty()) return null;
                
                return $this->formatProgramItem($area, $categoria, $grados);
            })->filter();
        })->values()->toArray();
    }

    private function formatProgramItem($area, $categoria, $grados)
    {
        $gradosOrdenados = $grados->sortBy('numeroGrado')->values();
        $primero = $gradosOrdenados->first();
        $ultimo = $gradosOrdenados->last();
        $mismoNivel = $gradosOrdenados->every(fn($g) => $g->nivel === $primero->nivel);

        $gradoFormateado = $this->formatGrados($gradosOrdenados, $primero, $ultimo, $mismoNivel);

        return [
            'area' => $area->nombreArea,
            'nivel' => $categoria->nombreCategoria,
            'grados' => $gradoFormateado,
            'area_id' => $area->idArea,
            'categoria_id' => $categoria->idCategoria,
            'costo' => $categoria->pivot->costo,
        ];
    }

    private function formatGrados($grados, $primero, $ultimo, $mismoNivel)
    {
        if ($grados->count() === 1) {
            return $this->formatSingleGrado($primero->numeroGrado, $primero->nivel);
        }

        return $mismoNivel 
            ? "{$primero->numeroGrado}° a {$ultimo->numeroGrado}° {$primero->nivel}"
            : $grados->map(fn($g) => $this->formatSingleGrado($g->numeroGrado, $g->nivel))->implode(' / ');
    }

    private function formatSingleGrado($numero, $nivel)
    {
        $simbolo = is_numeric($numero) ? "{$numero}°" : $numero;
        return "{$simbolo} {$nivel}";
    }
}