<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('localities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('province_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('psgc_code', 20)->nullable();
            $table->string('name');

            // 👇 THIS was missing
            $table->enum('locality_type', ['CITY', 'MUNICIPALITY', 'DISTRICT']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('localities');
    }
};
