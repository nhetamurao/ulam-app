<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;

class CommentSeeder extends Seeder
{
    public function run()
    {
        Comment::insert([
            [
                'shop_id' => 1,
                'user_id' => 3,
                'content' => 'Great food and service!',
            ],
            [
                'shop_id' => 2,
                'user_id' => 3,
                'content' => 'I love the barbecue here.',
            ]
        ]);
    }
}