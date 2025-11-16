<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            ['name' => 'Admin User', 'email' => 'admin@example.com', 'password' => Hash::make('password')],
            ['name' => 'Andreas Luy', 'email' => 'luy.andreas@student.auf.edu.ph', 'password' => Hash::make('admin123')],
            ['name' => 'Kenneth Amurao', 'email' => 'amurao.kenneth@student.auf.edu.ph', 'password' => Hash::make('password')],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(['email' => $user['email']], $user);
        }
    }
}
