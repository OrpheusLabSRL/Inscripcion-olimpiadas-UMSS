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

    // Relación con Categoría (tabla pivote: categoria_grado)
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
