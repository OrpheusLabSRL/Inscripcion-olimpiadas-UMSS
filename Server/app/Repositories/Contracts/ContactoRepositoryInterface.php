<?php

namespace App\Repositories\Contracts;

interface ContactoRepositoryInterface
{
    /**
     * Almacena y/o envía un mensaje de contacto
     * @param array $datos
     * @return bool
     */
    public function enviarMensaje(array $datos): bool;
}
