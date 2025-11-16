<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            // Text fields for descriptions
            $table->text('short_description')->nullable()->after('name');
            $table->longText('long_description')->nullable()->after('short_description');

            // Image URL
            $table->string('cover_image_url', 2048)->nullable()->after('long_description');

            // Address / location hint
            $table->string('address_text')->nullable()->after('cover_image_url');

            // Price level (e.g. budget/mid/premium or ₱)
            $table->string('price_level', 50)->nullable()->after('address_text');

            // Published flag
            $table->boolean('is_published')->default(true)->after('price_level');
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn([
                'short_description',
                'long_description',
                'cover_image_url',
                'address_text',
                'price_level',
                'is_published',
            ]);
        });
    }
};
