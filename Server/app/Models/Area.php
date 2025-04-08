<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'areas';

    protected $primaryKey = 'idArea';

    protected $fillable = [
        'idOlimpiada',
        'nombreArea',
        'descripcionArea',
        'costoArea',
        'estadoArea',
    ];

    // Relacion: Un área pertenece a una Olimpiada
    public function olimpiada()
    {
        return $this->belongsTo(Olimpiada::class, 'idOlimpiada', 'idOlimpiada');
    }

    public function categorias()
{
    return $this->belongsToMany(
        Categoria::class,
        'area_categoria',
        'area_id',       // FK en la tabla pivot a este modelo (Area)
        'categoria_id',  // FK en la tabla pivot a Categoria
        'idArea',        // PK en el modelo Area
        'idCategoria'    // PK en el modelo Categoria
    )->withPivot('estadoAreaCategoria')->withTimestamps();
}
}
