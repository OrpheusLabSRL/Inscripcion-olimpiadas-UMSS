<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'area';
    protected $primaryKey = 'idArea';

    protected $fillable = [
        'nombreArea',
        'descripcionArea',
        'costoArea',
        'estadoArea',
    ];

    // Relación: un área pertenece a muchas olimpiadas (pivot: olimpiada_area)
    public function olimpiadas()
    {
        return $this->belongsToMany(
            Olimpiada::class,
            'olimpiada_area',
            'idArea',
            'idOlimpiada'
        )->withPivot('estadoOlimpArea');
    }

    // Relación: un área tiene muchas categorías (pivot: area_categoria)
    public function categorias()
    {
        return $this->belongsToMany(
            Categoria::class,
            'area_categoria',
            'idArea',
            'idCategoria'
        )->withPivot('estadoAreaCategoria');
    }
}
