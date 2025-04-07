<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Olimpista extends Model
{
    use HasFactory;

    protected $table = 'olimpistas';

    protected $fillable = [
        'correoComp',
        'apellidosComp',
        'NombresComp',
        'carnetComp',
        'fechaNacimiento',
        'colegio',
        'departamento',
        'provincia',
    ];
    

    public function inscripciones()
{
    return $this->hasMany(Inscripcion::class, 'idOlimpista', 'idOlimpista');
}

}
