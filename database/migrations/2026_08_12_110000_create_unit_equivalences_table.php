<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_equivalences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('units')->onDelete('cascade');
            $table->foreignId('parent_unit_id')->constrained('units')->onDelete('cascade');
            $table->decimal('factor', 12, 4);
            $table->timestamps();
            $table->unique('unit_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_equivalences');
    }
};
