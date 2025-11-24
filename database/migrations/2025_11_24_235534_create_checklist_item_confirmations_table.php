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
        Schema::create('checklist_item_confirmations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('checklist_item_id')->constrained('checklist_details')->onDelete('cascade');
            $table->boolean('se_compro')->default(false);
            $table->foreignId('place_final_id')->nullable()->constrained('places')->onDelete('set null');
            $table->foreignId('unit_final_id')->nullable()->constrained('units')->onDelete('set null');
            $table->integer('cantidad_comprada')->default(0);
            $table->decimal('precio_unitario', 10, 2)->default(0);
            $table->decimal('precio_total', 10, 2)->default(0);
            $table->date('fecha_compra')->nullable();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checklist_item_confirmations');
    }
};
