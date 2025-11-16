<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Like;

class LikeSeeder extends Seeder
{
    public function run()
    {
        Like::insert([
            ['shop_id' => 1, 'user_id' => 3],
            ['shop_id' => 2, 'user_id' => 3],
        ]);
    }
}