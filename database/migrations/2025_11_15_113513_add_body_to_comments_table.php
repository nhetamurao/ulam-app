<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Add body column only if it does not already exist.
            // (If you’re sure it doesn’t exist, you can skip the hasColumn check.)
            if (!Schema::hasColumn('comments', 'body')) {
                $table->text('body')->nullable()->after('user_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            if (Schema::hasColumn('comments', 'body')) {
                $table->dropColumn('body');
            }
        });
    }
};
