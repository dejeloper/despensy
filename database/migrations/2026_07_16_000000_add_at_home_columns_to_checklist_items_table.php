<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('checklist_items', function (Blueprint $table) {
            $table->integer('quantity_at_home')->nullable()->after('unit_id_planned');
            $table->foreignId('unit_id_at_home')->nullable()->after('quantity_at_home')->constrained('units')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('checklist_items', function (Blueprint $table) {
            $table->dropForeign(['unit_id_at_home']);
            $table->dropColumn(['quantity_at_home', 'unit_id_at_home']);
        });
    }
};
