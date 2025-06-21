<?php

namespace App\Repositories\Contracts;

interface InscripcionTutorRepositoryInterface
{
    public function consultarOlimpista(string $carnetIdentidad, string $correoElectronico): array;
    public function consultarTutor(string $carnetIdentidad, string $correoElectronico): array;
} 