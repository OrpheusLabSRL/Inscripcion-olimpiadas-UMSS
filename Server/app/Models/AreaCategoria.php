<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AreaCategoria extends Model
{
    use HasFactory;

    protected $table = 'area_categoria';
    protected $primaryKey = 'id_AreaCategoria';
    public $timestamps = false;

    protected $fillable = [
        'idArea',
        'idCategoria',
        'estadoAreaCategoria'
    ];

    public function area()
    {
        return $this->belongsTo(Area::class, 'idArea', 'idArea');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria', 'idCategoria');
    }
}
