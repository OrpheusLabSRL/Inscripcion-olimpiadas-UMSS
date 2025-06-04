<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    protected $primaryKey = 'idInscripcion';
    protected $fillable = [
        'idOlimpista',
        'idOlimpAreaCategoria',
        'idTutorResponsable',
        'idTutorLegal',
        'idTutorArea',
        'estadoInscripcion'
    ];

    public function olimpista()
    {
        return $this->belongsTo(Olimpista::class, 'idOlimpista');
    }

    public function areaCategoria()
    {
        return $this->belongsTo(OlimpiadaAreaCategoria::class, 'idOlimpAreaCategoria');
    }
}