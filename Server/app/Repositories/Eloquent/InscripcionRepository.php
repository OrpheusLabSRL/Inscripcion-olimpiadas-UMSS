<?php

namespace App\Repositories\Eloquent;
use App\Models\Inscripcion;
use App\Models\OlimpiadaAreaCategoria;
use App\Models\Persona;
use App\Repositories\Contracts\InscripcionRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InscripcionRepository implements InscripcionRepositoryInterface
{
    /**
     * Crear una nueva inscripción
     */
    public function crear(array $data)
    {
        return Inscripcion::create($data);
    }

    /**
     * Contar inscripciones por olimpiada
     */
    public function contarInscripcionesPorOlimpiada(int $idOlimpista, int $idOlimpiada): int
    {
        return Inscripcion::where('idOlimpista', $idOlimpista)
            ->whereHas('olimpiadaAreaCategoria', function ($query) use ($idOlimpiada) {
                $query->where('idOlimpiada', $idOlimpiada);
            })
            ->count();
    }

    /**
     * Obtener áreas con categorías por olimpista
     */
    public function obtenerAreasConCategoriasPorOlimpista(int $idOlimpista): Collection
    {
        $inscripciones = Inscripcion::where('idOlimpista', $idOlimpista)->get();
        $areaCategoriaIds = $inscripciones->pluck('idOlimpAreaCategoria')->unique();

        $areaCategorias = OlimpiadaAreaCategoria::with('area', 'categoria')
            ->whereIn('idOlimpAreaCategoria', $areaCategoriaIds)
            ->get();

        return $areaCategorias->groupBy('idArea')->map(function ($items, $areaId) {
            $area = $items->first()->area;

            return [
                'idArea' => $area->idArea,
                'nombreArea' => $area->nombreArea,
                'descripcionArea' => $area->descripcionArea,
                'costoArea' => $area->costoArea,
                'estadoArea' => $area->estadoArea,
                'categorias' => $items->map(function ($item) {
                    return [
                        'idCategoria' => $item->categoria->idCategoria ?? null,
                        'nombreCategoria' => $item->categoria->nombreCategoria ?? null,
                        'estadoCategoria' => $item->categoria->descripcionCategoria ?? null,
                    ];
                })->values()
            ];
        })->values();
    }

    /**
     * Obtener inscripciones por olimpista
     */
    public function obtenerInscripcionesPorOlimpista(int $idPersona): Collection
    {
        return Inscripcion::where('idOlimpista', $idPersona)
            ->with(['olimpiadaAreaCategoria.area', 'olimpiadaAreaCategoria.categoria'])
            ->get();
    }

    /**
     * Obtener inscripciones por tutor
     */
    public function obtenerInscripcionesPorTutor(int $idPersona): Collection
    {
        return Inscripcion::where(function($query) use ($idPersona) {
                $query->where('idTutorLegal', $idPersona)
                    ->orWhere('idTutorResponsable', $idPersona)
                    ->orWhere('idTutorArea', $idPersona);
            })
            ->with([
                'olimpiadaAreaCategoria.area',
                'olimpiadaAreaCategoria.categoria',
                'olimpista.persona'
            ])
            ->get();
    }

    /**
     * Procesar inscripciones completas
     */
    public function procesarInscripcionesCompletas(Collection $inscripciones): Collection
    {
        return $inscripciones->map(function ($inscripcion) {
            $tutorInfo = DB::table('tutores')
                ->join('personas', 'tutores.idPersona', '=', 'personas.idPersona')
                ->where('tutores.idPersona', $inscripcion->idTutorResponsable)
                ->select(
                    'personas.nombre',
                    'personas.apellido',
                    'personas.carnetIdentidad',
                    'personas.correoElectronico',
                    'tutores.tipoTutor',
                    'tutores.telefono'
                )
                ->first();

            return [
                'olimpiadaAreaCategoria' => [
                    'area' => $inscripcion->olimpiadaAreaCategoria->area,
                    'categoria' => $inscripcion->olimpiadaAreaCategoria->categoria
                ],
                'tutorResponsable' => $tutorInfo ? [
                    'nombre' => $tutorInfo->nombre,
                    'apellido' => $tutorInfo->apellido,
                    'carnetIdentidad' => $tutorInfo->carnetIdentidad,
                    'correoElectronico' => $tutorInfo->correoElectronico,
                    'tipoTutor' => $tutorInfo->tipoTutor,
                    'telefono' => $tutorInfo->telefono
                ] : null,
                'estadoInscripcion' => $inscripcion->estadoInscripcion,
                'tutorArea' => $inscripcion->idTutorArea ? Persona::find($inscripcion->idTutorArea) : null
            ];
        });
    }

    /**
     * Procesar inscripciones de tutor
     */
    public function procesarInscripcionesTutor(Collection $inscripciones, $persona): Collection
    {
        $inscripcionesAgrupadas = $inscripciones->groupBy('idOlimpista');

        return $inscripcionesAgrupadas->map(function ($inscripciones) use ($persona) {
            $primeraInscripcion = $inscripciones->first();
            $olimpista = $primeraInscripcion->olimpista;
            $personaOlimpista = $olimpista->persona;

            // Determinar el tipo de tutor para este olimpista
            $tipoTutor = [];
            foreach ($inscripciones as $inscripcion) {
                if ($inscripcion->idTutorLegal == $persona->idPersona) {
                    $tipoTutor[] = 'Tutor Legal';
                }
                if ($inscripcion->idTutorResponsable == $persona->idPersona) {
                    $tipoTutor[] = 'Tutor Responsable';
                }
                if ($inscripcion->idTutorArea == $persona->idPersona) {
                    $tipoTutor[] = 'Tutor de Área';
                }
            }

            // Verificar si hay pagos pendientes
            $tienePagosPendientes = $inscripciones->contains(function ($inscripcion) {
                return $inscripcion->estadoInscripcion == 0;
            });

            return [
                'nombre' => $personaOlimpista->nombre,
                'apellido' => $personaOlimpista->apellido,
                'carnetIdentidad' => $personaOlimpista->carnetIdentidad,
                'tipoTutor' => implode(', ', array_unique($tipoTutor)),
                'estadoPago' => $tienePagosPendientes ? 'PAGO PENDIENTE' : 'PAGO REALIZADO'
            ];
        })->values();
    }

    /**
     * Obtener último código de inscripción
     */
    public function obtenerUltimoCodigoInscripcion(): ?string
    {
        return Inscripcion::max('codigoInscripcion');
    }

    /**
     * Finalizar registro
     */
    public function finalizarRegistro(int $idTutorResponsable, string $codigoInscripcion): void
    {
        Inscripcion::where('idTutorResponsable', $idTutorResponsable)
            ->where('codigoInscripcion', $codigoInscripcion)
            ->update(['registrandose' => false]);
    }

    /**
     * Obtener inscripciones con olimpiadas
     */
    public function obtenerInscripcionesConOlimpiadas(): Collection
    {
        $inscripciones = Inscripcion::with(['olimpista', 'OlimpiadaAreaCategoria.olimpiada'])
            ->get();

        return $inscripciones->map(function ($inscripcion) {
            return [
                'idInscripcion' => $inscripcion->idInscripcion,
                'estadoInscripcion' => $inscripcion->estadoInscripcion,
                'olimpista' => [
                    'nombre' => $inscripcion->olimpista->persona->nombre ?? '',
                    'apellido' => $inscripcion->olimpista->persona->apellido ?? '',
                    'carnet_identidad' => $inscripcion->olimpista->persona->carnetIdentidad ?? '',
                ],
                'idOlimpiada' => $inscripcion->OlimpiadaAreaCategoria->idOlimpiada ?? null,
            ];
        });
    }

    /**
     * Verificar uso de áreas en forma masiva
     */
    public function verificarUsoAreasMasivo(array $ids): array
    {
        $resultados = [];

        $areasEnUso = Inscripcion::whereHas('OlimpiadaAreaCategoria', function ($query) use ($ids) {
            $query->whereIn('idArea', $ids);
        })->with('OlimpiadaAreaCategoria')->get();

        // Agrupa las inscripciones por idArea
        $agrupadas = $areasEnUso->groupBy(fn ($inscripcion) => $inscripcion->OlimpiadaAreaCategoria->idArea);

        foreach ($ids as $idArea) {
            $resultados[$idArea] = [
                'enUso' => $agrupadas->has($idArea),
                'inscripciones' => $agrupadas->get($idArea, collect()),
            ];
        }

        return $resultados;
    }

    /**
     * Verificar uso de categorías en forma masiva
     */
    public function verificarUsoCategoriasMasivo(array $ids): array
    {
        $resultados = [];

        foreach ($ids as $idCategoria) {
            $enUso = Inscripcion::whereHas('OlimpiadaAreaCategoria', function ($query) use ($idCategoria) {
                $query->where('idCategoria', $idCategoria);
            })->exists();

            $resultados[$idCategoria] = $enUso;
        }

        return $resultados;
    }

    public function buscarPorId(int $idInscripcion): ?Inscripcion
    {
        return Inscripcion::find($idInscripcion);
    }

    public function eliminar(int $idInscripcion): bool
    {
        $inscripcion = $this->buscarPorId($idInscripcion);
        
        if (!$inscripcion) {
            return false;
        }
        
        return $inscripcion->delete();
    }
}