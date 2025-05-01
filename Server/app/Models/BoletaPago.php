<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoletaPago extends Model
{
    use HasFactory;

    protected $table = 'boletas_pagos';
    protected $primaryKey = 'codigoBoleta';

    protected $fillable = [
        'idTutor',
        'nombre_pagador',
        'fechaEmision',
        'montoTotal',
    ];

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'codigoBoleta', 'codigoBoleta');
    }
}

