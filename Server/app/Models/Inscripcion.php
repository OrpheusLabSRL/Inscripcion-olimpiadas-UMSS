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

public function areaCategoria()
{
    return $this->belongsTo(AreaCategoria::class, 'id_AreaCategoria');
}

public function area()
{
    return $this->hasOneThrough(
        Area::class,
        AreaCategoria::class,
        'id_AreaCategoria', // FK en AreaCategoria hacia Inscripcion
        'idArea',            // PK en Area
        'id_AreaCategoria',  // FK en Inscripcion
        'area_id'            // FK en AreaCategoria hacia Area
    );
}


}
