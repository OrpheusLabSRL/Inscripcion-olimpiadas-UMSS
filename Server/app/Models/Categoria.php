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

    // 🔁 Relación con áreas (tabla intermedia: area_categoria)
    public function areas()
    {
        return $this->belongsToMany(
            Area::class,
            'area_categoria',
            'categoria_id', // foreignKey en tabla intermedia que apunta a esta tabla
            'area_id',      // foreignKey que apunta a la tabla 'areas'
            'idCategoria',  // clave primaria local
            'idArea'        // clave primaria del modelo relacionado
        )->withPivot('estadoAreaCategoria');
    }

    // 🔁 Relación con grados (tabla intermedia: categoria_grados)
    public function grados()
    {
        return $this->belongsToMany(
            Grados::class,
            'categoria_grados',
            'categoria_id',
            'grado_id',
            'idCategoria',
            'idGrado'
        )->withPivot('estadoCategoriaGrado');
    }
}
