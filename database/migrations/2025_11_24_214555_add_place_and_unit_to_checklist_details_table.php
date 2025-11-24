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
        Schema::table('checklist_details', function (Blueprint $table) {
            $table->unsignedBigInteger('place_suggested_id')->nullable();
            $table->unsignedBigInteger('unit_suggested_id')->nullable();
            $table->foreign('place_suggested_id')->references('id')->on('places')->onDelete('set null');
            $table->foreign('unit_suggested_id')->references('id')->on('units')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('checklist_details', function (Blueprint $table) {
            //
        });
    }
};
