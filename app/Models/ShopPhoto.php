<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopPhoto extends Model
{
    protected $fillable = [
        'shop_id',
        'file_url',
        'caption',
        'is_featured',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}