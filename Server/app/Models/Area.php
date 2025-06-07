<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaAreaCategoria;

class Area extends Model
{
    use HasFactory;

    protected $table = 'areas';
    protected $primaryKey = 'idArea';
    public $timestamps = false;

    protected $fillable = [
        'nombreArea',
        'descripcionArea',
        'estadoArea',   // nuevo campo
    ];

    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idArea');
    }

    public function categorias()
    {
        return $this->belongsToMany(
            Categoria::class,
            'olimpiadas_areas_categorias',
            'idArea',      
            'idCategoria',  
            'idArea',      
            'idCategoria'   
         )->withPivot('estado', 'costo', 'idOlimpiada');
    }
}
 