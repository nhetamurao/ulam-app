<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'shop_id',
        'user_id',
        'body',
        'content',    // add this if you ever use mass assignment
        // 'is_flagged',   // only if column exists in DB
        // 'photos_json',  // only if column exists in DB
    ];

    public function shop()
    {
    return $this->belongsTo(\App\Models\Shop::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}