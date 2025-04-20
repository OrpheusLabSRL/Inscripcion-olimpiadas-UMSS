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

    public function categorias()
    {
        return $this->belongsToMany(
            Categoria::class,
            'categoria_grado',
            'idGrado',
            'idCategoria'
        )->withPivot('estadoCategoriaGrado');
    }
}

