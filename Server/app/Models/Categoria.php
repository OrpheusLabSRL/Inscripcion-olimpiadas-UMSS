<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    protected $primaryKey = 'idCategoria';
    public $timestamps = false;

    protected $fillable = [
        'nombreCategoria',
        'estadoCategoria',
    ];

    // Scopes para reutilizar consultas
    public function scopeActivas($query)
    {
        return $query->where('estadoCategoria', true);
    }

    public function scopePorNombre($query, $nombre)
    {
        return $query->where('nombreCategoria', 'like', "%$nombre%");
    }

    // Relaciones
    public function grados()
    {
        return $this->belongsToMany(
            Grado::class, 
            'categorias_grados', 
            'categoria_id', 
            'grado_id'
        )->withPivot('estadoCategoriaGrado');
    }

    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idCategoria');
    }
}