<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Olimpista extends Model
{
    use HasFactory;

    protected $table = 'olimpistas';

    protected $primaryKey = 'id_olimpista';

    protected $fillable = [
        'correo',
        'apellido',
        'Nombre',
        'carnetIdentidad',
        'curso',
        'fechaNacimiento',
        'colegio',
        'departamento',
        'provincia',
    ];
    

    public function inscripciones()
{
    return $this->hasMany(Inscripcion::class, 'id_olimpista', 'id_olimpista');
}

public function tutores()
{
    return $this->belongsToMany(Tutor::class, 'olimpista_tutor', 'id_olimpista', 'id_tutor');
}


}
