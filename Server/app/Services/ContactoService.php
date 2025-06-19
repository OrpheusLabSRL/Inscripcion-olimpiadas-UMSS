<?php

namespace App\Services;

use App\Repositories\Contracts\ContactoRepositoryInterface;

class ContactoService
{
    protected $contactoRepository;

    public function __construct(ContactoRepositoryInterface $contactoRepository)
    {
        $this->contactoRepository = $contactoRepository;
    }

    public function enviarMensaje(array $datos): bool
    {
        // Aquí puedes agregar validaciones adicionales si lo deseas
        return $this->contactoRepository->enviarMensaje($datos);
    }
} 