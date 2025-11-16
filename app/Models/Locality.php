<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Locality extends Model
{
    protected $fillable = [
        'province_id',
        'psgc_code',
        'name',
        'locality_type',
    ];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function shops()
    {
        return $this->hasMany(Shop::class);
    }
}