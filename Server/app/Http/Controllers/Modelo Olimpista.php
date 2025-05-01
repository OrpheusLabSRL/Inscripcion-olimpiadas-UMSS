<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Olimpista extends Model
{
    use HasFactory;

    protected $primaryKey = 'idOlimpista';
    protected $fillable = [
        'idPersona',
        'fechaNacimiento',
        'departamento',
        'municipio',
        'colegio',
        'curso'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idPersona', 'idPersona');
    }

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'idOlimpista');
    }
}