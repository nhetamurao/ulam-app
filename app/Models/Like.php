<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'shop_id',
        'created_at',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}