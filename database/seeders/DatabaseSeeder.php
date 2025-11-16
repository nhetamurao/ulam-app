<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create a default user (see password note below)
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            RegionSeeder::class,
            ProvinceSeeder::class,
            LocalitySeeder::class,

            RoleSeeder::class,
            UserSeeder::class,
            UserRoleSeeder::class,

            ShopSeeder::class,
            ShopPhotoSeeder::class,
            CommentSeeder::class,
            LikeSeeder::class,
        ]);
    }
}
