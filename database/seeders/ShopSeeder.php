<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shop;
use App\Models\User;
use App\Models\Locality;

class ShopSeeder extends Seeder
{
    /**
     * Seed example hidden gems with real cover images.
     */
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }

        $localities = Locality::all();

        if ($localities->isEmpty()) {
            $this->command->error('No localities found. Please run Region/Province/Locality seeders first.');
            return;
        }

        // NOTE: Image URLs are from Unsplash + your earlier Google photo.
        // They are public and safe to use for demos/prototypes.
        $gems = [
            [
                'name'              => 'Mang Juan Eatery',
                'short_description' => 'Crispy sisig and lutong-bahay ulam loved by students.',
                'long_description'  => 'Cozy carinderia serving sisig, tapsilog, and daily viands. Very popular with nearby school folks and office workers.',
                'address_text'      => 'Angeles City, Pampanga',
                'avg_cost_hint'     => 'budget',
                'cover_image_url'   => 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzT0EB1x36USJCc6FXvbq-O-XLnxKGLr94rRJ61Ob7FpCLjEOhWV2uYbT9DYB2rLjS4BjAo61pFYIQMDYmgaD3hkbDtxH7gKtshivkI0zWp3W5lWkHrlfcV4x9S0HJIq_lJzmMD=s680-w680-h510-rw',
            ],
            [
                'name'              => 'Lutong Bahay Carinderia',
                'short_description' => 'Home-style ulam that feels like Sunday lunch.',
                'long_description'  => 'Daily rotating ulam such as sinigang, adobo, giniling, and pinakbet. Best with extra rice and unli-sabaw.',
                'address_text'      => 'Dinalupihan, Bataan',
                'avg_cost_hint'     => 'budget',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=1800',
            ],
            [
                'name'              => 'Sabaw & Silog Station',
                'short_description' => 'All-day silog meals with unlimited sabaw.',
                'long_description'  => 'Affordable tapsilog, tocilog, longsilog and more, served with hot soup on the side. Favorite stop after night shift.',
                'address_text'      => 'Balanga, Bataan',
                'avg_cost_hint'     => 'budget',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1555265399-48aa9c11d869?w=1800',
            ],
            [
                'name'              => 'Barrio Grill House',
                'short_description' => 'Grilled chicken and liempo for barkada nights.',
                'long_description'  => 'Charcoal-grilled favorites with inihaw na liempo, manok, and isaw. Best paired with rice and iced tea tower.',
                'address_text'      => 'San Fernando, Pampanga',
                'avg_cost_hint'     => 'mid',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1604296706014-1780746d6f57?w=1800',
            ],
            [
                'name'              => 'Premium Ihaw-Ihaw Spot',
                'short_description' => 'Payday ihaw-ihaw with a slightly fancier vibe.',
                'long_description'  => 'Liempo, pork belly, seafood skewers and signature sauces in a semi-open air setting with acoustic nights.',
                'address_text'      => 'Angeles City, Pampanga',
                'avg_cost_hint'     => 'premium',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1622003074877-15f50ba7b6f8?w=1800',
            ],
            [
                'name'              => 'Carinderia del Barrio',
                'short_description' => 'Classic “lutong-barrio” favorites for everyday meals.',
                'long_description'  => 'Open-air carinderia serving menudo, bopis, dinuguan, and veggie dishes. Locals love the crispy lumpia and pancit.',
                'address_text'      => 'Apalit, Pampanga',
                'avg_cost_hint'     => 'budget',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1570263495075-b8258671743f?w=1800',
            ],
            [
                'name'              => 'Kuya Dodong’s Seafood Grill',
                'short_description' => 'Fresh seafood grilled Filipino-style.',
                'long_description'  => 'Pusit, bangus, tahong, and hipon cooked ihaw style. Best for family dinners and barkada seafood nights.',
                'address_text'      => 'Subic Bay Freeport Zone',
                'avg_cost_hint'     => 'premium',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1800',
            ],
            [
                'name'              => 'Rice & More Eatery',
                'short_description' => 'Unli-rice spot with classic viands.',
                'long_description'  => 'Budget-friendly ulam like fried chicken, burger steak, and tapa, with unli-rice and sabaw for big appetites.',
                'address_text'      => 'Guagua, Pampanga',
                'avg_cost_hint'     => 'budget',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1575911809913-918414ae6bc8?w=1800',
            ],
            [
                'name'              => 'Pares sa Kanto',
                'short_description' => 'Beef pares, mami, and siomai combo.',
                'long_description'  => 'Late-night paresan serving tender beef pares with garlic rice and soup. Popular with drivers and commuters.',
                'address_text'      => 'Quezon City-style pares, now in Bataan',
                'avg_cost_hint'     => 'budget',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1625604086816-4bfaf603e842?w=1800',
            ],
            [
                'name'              => 'Bento ni Senpai',
                'short_description' => 'Japanese-inspired bento at Filipino prices.',
                'long_description'  => 'Katsu, karaage, and tempura bento boxes with rice and side dishes. Great alternative to usual carinderia fare.',
                'address_text'      => 'San Fernando, Pampanga',
                'avg_cost_hint'     => 'mid',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1657823135451-1b6ed3c64a41?w=1800',
            ],
            [
                'name'              => 'Chicken Inasal Corner',
                'short_description' => 'Smoky inasal with unlimited rice.',
                'long_description'  => 'Visayas-style chicken inasal marinated in calamansi and spices, grilled over charcoal and brushed with chicken oil.',
                'address_text'      => 'Olongapo City',
                'avg_cost_hint'     => 'mid',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1611489142329-5f62cfa43e6e?w=1800',
            ],
            [
                'name'              => 'Pampanga Sisig House',
                'short_description' => 'Sizzling sisig on a hot plate.',
                'long_description'  => 'Kapampangan-style pork sisig served on sizzling plates with egg and calamansi. Pair with rice or pulutan with friends.',
                'address_text'      => 'Angeles City, Pampanga',
                'avg_cost_hint'     => 'mid',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1800',
            ],
            [
                'name'              => 'Empanada ni Aling Nena',
                'short_description' => 'Freshly fried empanadas and merienda picks.',
                'long_description'  => 'Carinderia corner focused on empanada, turon, and other merienda favorites for students and office workers.',
                'address_text'      => 'Balanga town proper',
                'avg_cost_hint'     => 'budget',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=1800',
            ],
            [
                'name'              => 'Pork Steak & Veggies Grill',
                'short_description' => 'Hearty grilled plates with veggies on the side.',
                'long_description'  => 'Big plates of grilled pork or beef with buttered veggies and rice. A favorite payday treat.',
                'address_text'      => 'Mexico, Pampanga',
                'avg_cost_hint'     => 'premium',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1622003074877-15f50ba7b6f8?w=1800',
            ],
            [
                'name'              => 'Fiesta Plato Carinderia',
                'short_description' => 'Colorful plates that feel like fiesta everyday.',
                'long_description'  => 'Combination meals of barbecue, pancit, and lumpia, plated colorfully and served fast.',
                'address_text'      => 'Lubao, Pampanga',
                'avg_cost_hint'     => 'mid',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1695683947938-284625175e41?w=1800',
            ],
            [
                'name'              => 'Sunday Ulam Special',
                'short_description' => 'Slow-cooked ulam perfect for family lunch.',
                'long_description'  => 'Kaldereta, mechado, and pork steak options that taste like luto ni nanay during Sunday reunions.',
                'address_text'      => 'Samal, Bataan',
                'avg_cost_hint'     => 'mid',
                'cover_image_url'   => 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=1800',
            ],
        ];

        foreach ($gems as $index => $gem) {
            $locality = $localities[$index % $localities->count()];

            Shop::firstOrCreate(
                [
                    'name'        => $gem['name'],
                    'locality_id' => $locality->id,
                ],
                [
                    'user_id'           => $user->id,
                    'short_description' => $gem['short_description'],
                    'long_description'  => $gem['long_description'],
                    'address_text'      => $gem['address_text'],
                    'cover_image_url'   => $gem['cover_image_url'],
                    'avg_cost_hint'     => $gem['avg_cost_hint'], // budget | mid | premium
                    'is_published'      => true,
                ]
            );
        }

        $this->command->info('Sample shops with cover images seeded successfully.');
    }
}
