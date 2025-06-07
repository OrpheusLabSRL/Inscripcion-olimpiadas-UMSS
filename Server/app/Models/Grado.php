<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grado extends Model
{
    use HasFactory;

    protected $table = "grados";
    protected $primaryKey = 'idGrado';
    public $timestamps = false;

    protected $fillable = [
        'numeroGrado',
        'nivel',
        'estadoGrado'
    ];

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estadoGrado', true);
    }

    public function scopePorNivel($query, $nivel)
    {
        return $query->where('nivel', $nivel);
    }

    // Relaciones
    public function categorias()
    {
        return $this->belongsToMany(
            Categoria::class,
            'categorias_grados',
            'idGrado',
            'idCategoria'
        )->withPivot('estadoCategoriaGrado');
    }
}