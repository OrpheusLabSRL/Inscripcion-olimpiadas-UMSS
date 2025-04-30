<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformacionContacto extends Model
{
    use HasFactory;

    protected $table = 'informacion_contactos';
    protected $primaryKey = 'id_contacto';
    public $timestamps = true;

    protected $fillable = [
        'correo_contacto',
        'pertenece_correo',
        'numero_contacto',
        'pertenece_numero',
        'id_olimpista',
    ];

    public function olimpista()
    {
        return $this->belongsTo(Olimpista::class, 'id_olimpista', 'id_olimpista');
    }
}

