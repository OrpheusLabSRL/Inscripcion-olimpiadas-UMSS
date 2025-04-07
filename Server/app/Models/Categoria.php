<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = [
        'nombreCategoria',
        'estadoCategoria'
    ];

    // Relacion Muchos a Muchos con Areas
    public function areas()
    {
        return $this->belongsToMany(Area::class, 'area_categoria', 'categoria_id', 'area_id')
                    ->withPivot('estadoAreaCategoria') 
                    ->withTimestamps(); 
    }

    public function grados()
    {
        return $this->belongsToMany(Grados::class, 'categoria_grados', 'categoria_id', 'grado_id')
                    ->withPivot('estadoCategoriaGrado') 
                    ->withTimestamps(); 
    }
}
