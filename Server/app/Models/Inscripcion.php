<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    protected $table = 'inscripcion';

    protected $fillable = [
        'estadoInscripcion',
        'fechaInicioInsc',
        'fechaFinInsc',
    ];

    public function olimpista()
{
    return $this->belongsTo(Olimpista::class, 'idOlimpista', 'idOlimpista');
}

}
