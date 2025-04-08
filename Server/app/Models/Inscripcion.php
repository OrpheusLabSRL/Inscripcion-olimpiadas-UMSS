<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    protected $table = 'inscripciones';

    protected $primaryKey = 'id_inscripcion';

    protected $fillable = [
        'estado',
        'fechaInicio',
        'fechaFin',
        'id_olimpista',
        'id_AreaCategoria'
    ];

    public function olimpista()
{
    return $this->belongsTo(Olimpista::class, 'id_olimpista', 'id_olimpista');
}

}
