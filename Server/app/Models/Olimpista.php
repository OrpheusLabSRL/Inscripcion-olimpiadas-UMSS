<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Olimpista extends Model
{
    use HasFactory;

    protected $primaryKey = 'idPersona';
    public $incrementing = false;
    protected $fillable = [
        'fechaNacimiento',
        'departamento',
        'municipio',
        'curso',
        'colegio',
        'idPersona'
    ];

    // Relación con Persona
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idPersona');
    }

    // Relación con Inscripciones (un clímpista puede tener muchas inscripciones)
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'idOlimpista');
    }
}