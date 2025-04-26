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
        'costoArea',
        'estadoArea',
    ];

    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idArea');
    }

    public function categorias()
    {
        return $this->belongsToMany(
            Categoria::class,
            'area_categoria_olimpiada', 
            'idArea',                   
            'idCategoria'              
        );
    }

}
