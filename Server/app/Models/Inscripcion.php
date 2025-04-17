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
        'idOlimpAreaCategoria',
        'id_tutor',
    ];

    public function olimpista()
{
    return $this->belongsTo(Olimpista::class, 'id_olimpista', 'id_olimpista');
}

public function tutor()
{
    return $this->belongsTo(Tutor::class, 'id_tutor', 'id_tutor');
}

public function OlimpiadaAreaCategoria()
{
    return $this->belongsTo(OlimpiadaAreaCategoria::class, 'idOlimpAreaCategoria');
}

public function area()
{
    return $this->hasOneThrough(
        Area::class,
        OlimpiadaAreaCategoria::class,
        'idOlimpAreaCategoria', // FK en AreaCategoria hacia Inscripcion
        'idArea',            // PK en Area
        'idOlimpAreaCategoria',  // FK en Inscripcion
        'idArea'            // FK en AreaCategoria hacia Area
    );
}


}
