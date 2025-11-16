<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shop;
use App\Models\ShopPhoto;

class ShopPhotoSeeder extends Seeder
{
    public function run(): void
    {
        // Map shop names to arrays of image URLs
        $photos = [
            'Mang Juan Eatery' => [
                'https://example.com/mang-juan-1.jpg',
                'https://example.com/mang-juan-2.jpg',
            ],
            'Lutong Bahay Carinderia' => [
                'https://example.com/lutong-1.jpg',
            ],
            // add more mapping as needed
        ];

        foreach ($photos as $shopName => $urls) {
            $shop = Shop::where('name', $shopName)->first();

            if (!$shop) {
                continue;
            }

            foreach ($urls as $url) {
                ShopPhoto::create([
                    'shop_id' => $shop->id,
                    'url'     => $url,    // ✔ matches migration
                ]);
            }
        }
    }
}
