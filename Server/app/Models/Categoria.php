<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categoria';
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
            'idCategoria',
            'idArea'
        )->withPivot('estadoAreaCategoria');
    }

    // 🔁 Relación con grados (tabla intermedia: categoria_grado)
    public function grados()
    {
        return $this->belongsToMany(
            Grado::class,
            'categoria_grado',
            'idCategoria',
            'idGrado'
        )->withPivot('estadoCategoriaGrado');
    }
}