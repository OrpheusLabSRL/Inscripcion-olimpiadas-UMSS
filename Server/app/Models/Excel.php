<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Excel extends Model
{
    protected $table = 'olimpiadas_areas_categorias';
    protected $primaryKey = 'idOlimpAreaCategoria';
    public $timestamps = false;

    protected $fillable = [
        'idOlimpiada',
        'idArea',
        'idCategoria',
        'estado'
    ];

    public function area()
    {
        return $this->belongsTo(Area::class, 'idArea');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria');
    }

    public static function getAvailableCombinations()
    {
        return self::with(['area', 'categoria'])
            ->where('estado', 1)
            ->get()
            ->map(function($item) {
                return [
                    'area' => $item->area->nombreArea,
                    'categoria' => $item->categoria->nombreCategoria
                ];
            });
    }

    public static function validateAreaCategoryCombination($area, $category)
    {
        return DB::table('olimpiadas_areas_categorias')
            ->join('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
            ->join('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
            ->where('areas.nombreArea', $area)
            ->where('categorias.nombreCategoria', $category)
            ->exists();
    }

    public static function getAvailableCategoriesForArea($area)
    {
        return DB::table('olimpiadas_areas_categorias')
            ->join('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
            ->join('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
            ->where('areas.nombreArea', $area)
            ->pluck('categorias.nombreCategoria')
            ->toArray();
    }
}