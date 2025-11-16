<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocalitySeeder extends Seeder
{
    public function run(): void
    {
        $localities = [
            // Pampanga (province_id = 1)
            ['id' => 1,  'province_id' => 1, 'name' => 'Angeles City',           'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 2,  'province_id' => 1, 'name' => 'City of San Fernando',   'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 3,  'province_id' => 1, 'name' => 'Mabalacat City',         'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 4,  'province_id' => 1, 'name' => 'Porac',                  'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 5,  'province_id' => 1, 'name' => 'Mexico',                 'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 6,  'province_id' => 1, 'name' => 'Guagua',                 'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 7,  'province_id' => 1, 'name' => 'Apalit',                 'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],

            // Tarlac (province_id = 2)
            ['id' => 8,  'province_id' => 2, 'name' => 'Tarlac City',            'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 9,  'province_id' => 2, 'name' => 'Concepcion',             'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 10, 'province_id' => 2, 'name' => 'Capas',                  'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 11, 'province_id' => 2, 'name' => 'Gerona',                 'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],

            // Nueva Ecija (province_id = 3)
            ['id' => 12, 'province_id' => 3, 'name' => 'Cabanatuan City',        'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 13, 'province_id' => 3, 'name' => 'Gapan City',             'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 14, 'province_id' => 3, 'name' => 'San Jose City',          'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 15, 'province_id' => 3, 'name' => 'Palayan City',           'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 16, 'province_id' => 3, 'name' => 'San Isidro',             'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],

            // Bulacan (province_id = 4)
            ['id' => 17, 'province_id' => 4, 'name' => 'Malolos City',           'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 18, 'province_id' => 4, 'name' => 'Meycauayan City',        'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 19, 'province_id' => 4, 'name' => 'San Jose del Monte City','locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 20, 'province_id' => 4, 'name' => 'Baliuag',                'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],

            // Bataan (province_id = 5)
            ['id' => 21, 'province_id' => 5, 'name' => 'Balanga City',           'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 22, 'province_id' => 5, 'name' => 'Mariveles',              'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 23, 'province_id' => 5, 'name' => 'Dinalupihan',            'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],

            // Zambales (province_id = 6)
            ['id' => 24, 'province_id' => 6, 'name' => 'Olongapo City',          'locality_type' => 'CITY',         'psgc_code' => null],
            ['id' => 25, 'province_id' => 6, 'name' => 'Iba',                    'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 26, 'province_id' => 6, 'name' => 'Subic',                  'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],

            // Aurora (province_id = 7)
            ['id' => 27, 'province_id' => 7, 'name' => 'Baler',                  'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
            ['id' => 28, 'province_id' => 7, 'name' => 'Maria Aurora',           'locality_type' => 'MUNICIPALITY', 'psgc_code' => null],
        ];

        DB::table('localities')->upsert(
            $localities,
            ['id'],
            ['province_id', 'name', 'locality_type', 'psgc_code']
        );
    }
}
