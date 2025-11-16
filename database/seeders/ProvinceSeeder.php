<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            // All under Region III (id = 1)
            ['id' => 1, 'region_id' => 1, 'name' => 'Pampanga',     'psgc_code' => null],
            ['id' => 2, 'region_id' => 1, 'name' => 'Tarlac',       'psgc_code' => null],
            ['id' => 3, 'region_id' => 1, 'name' => 'Nueva Ecija',  'psgc_code' => null],
            ['id' => 4, 'region_id' => 1, 'name' => 'Bulacan',      'psgc_code' => null],
            ['id' => 5, 'region_id' => 1, 'name' => 'Bataan',       'psgc_code' => null],
            ['id' => 6, 'region_id' => 1, 'name' => 'Zambales',     'psgc_code' => null],
            ['id' => 7, 'region_id' => 1, 'name' => 'Aurora',       'psgc_code' => null],
        ];

        DB::table('provinces')->upsert(
            $provinces,
            ['id'],
            ['region_id', 'name', 'psgc_code']
        );
    }
}
