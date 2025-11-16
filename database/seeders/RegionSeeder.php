<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            [
                'id'        => 1,
                'name'      => 'Region III - Central Luzon',
                'psgc_code' => null, // set real PSGC codes later if you want
            ],
            // you can add more regions here later
        ];

        // idempotent: safe to run multiple times
        DB::table('regions')->upsert(
            $regions,
            ['id'],                // unique key
            ['name', 'psgc_code']  // columns to update if exists
        );
    }
}
