<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface InscripcionRepositoryInterface
{
    /**
     * Crear una nueva inscripción
     */
    public function crear(array $data);

    /**
     * Contar inscripciones por olimpiada
     */
    public function contarInscripcionesPorOlimpiada(int $idOlimpista, int $idOlimpiada): int;

    /**
     * Obtener áreas con categorías por olimpista
     */
    public function obtenerAreasConCategoriasPorOlimpista(int $idOlimpista): Collection;

    /**
     * Obtener inscripciones por olimpista
     */
    public function obtenerInscripcionesPorOlimpista(int $idPersona): Collection;

    /**
     * Obtener inscripciones por tutor
     */
    public function obtenerInscripcionesPorTutor(int $idPersona): Collection;

    /**
     * Procesar inscripciones completas
     */
    public function procesarInscripcionesCompletas(Collection $inscripciones): Collection;

    /**
     * Procesar inscripciones de tutor
     */
    public function procesarInscripcionesTutor(Collection $inscripciones, $persona): Collection;

    /**
     * Obtener último código de inscripción
     */
    public function obtenerUltimoCodigoInscripcion(): ?string;

    /**
     * Finalizar registro
     */
    public function finalizarRegistro(int $idTutorResponsable, string $codigoInscripcion): void;

    /**
     * Obtener inscripciones con olimpiadas
     */
    public function obtenerInscripcionesConOlimpiadas(): Collection;

    /**
     * Verificar uso de áreas en forma masiva
     */
    public function verificarUsoAreasMasivo(array $ids): array;

    /**
     * Verificar uso de categorías en forma masiva
     */
    public function verificarUsoCategoriasMasivo(array $ids): array;
}