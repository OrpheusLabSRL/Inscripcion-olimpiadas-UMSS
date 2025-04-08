<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AreaCategoria extends Model
{
    use HasFactory;

    protected $table = 'area_categoria'; // Nombre de la tabla exacto
    protected $primaryKey = 'id_AreaCategoria'; // PK personalizada

    protected $fillable = [
        'area_id',
        'categoria_id',
        'estadoAreaCategoria'
    ];
}
