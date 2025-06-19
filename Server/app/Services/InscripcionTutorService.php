<?php

namespace App\Services;

use App\Models\Persona;
use App\Models\Olimpista;
use App\Models\Tutor;
use Illuminate\Support\Facades\DB;
use App\Repositories\Contracts\InscripcionTutorRepositoryInterface;

class InscripcionTutorService
{
    protected $inscripcionTutorRepository;

    public function __construct(InscripcionTutorRepositoryInterface $inscripcionTutorRepository)
    {
        $this->inscripcionTutorRepository = $inscripcionTutorRepository;
    }

    public function consultar(array $data): array
    {
        $carnetIdentidad = $data['carnetIdentidad'];
        $correoElectronico = $data['correoElectronico'];
        $rol = $data['rol'];

        if ($rol === 'olimpista') {
            return $this->inscripcionTutorRepository->consultarOlimpista($carnetIdentidad, $correoElectronico);
        } else {
            return $this->inscripcionTutorRepository->consultarTutor($carnetIdentidad, $correoElectronico);
        }
    }
} 