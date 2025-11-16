<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    protected $fillable = [
        'locality_id',
        'user_id', // 👈 use user_id instead of created_by
        'name',
        'slug',
        'short_description',
        'long_description',
        'address_text',
        'avg_cost_hint',
        'is_published',
        'published_at',
        'cover_image_url',
        'deleted_at',
    ];

    public function locality()
    {
        return $this->belongsTo(Locality::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function photos()
    {
        return $this->hasMany(ShopPhoto::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }
}