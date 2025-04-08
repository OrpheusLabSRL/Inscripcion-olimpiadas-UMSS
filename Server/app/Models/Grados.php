<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grados extends Model
{
    use HasFactory;

    protected $table = "grados";
    protected $primaryKey = 'idGrado';

    protected $fillable = [
        'numeroGrado',
        'nivel',
        'estadoGrado'
    ];

    public function grados()
    {
        return $this->belongsToMany(Grados::class, 'categoria_grados', 'categoria_id', 'grado_id')
                    ->withPivot('estadoCategoriaGrado') 
                    ->withTimestamps(); 
    }
}
