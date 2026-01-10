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
        Schema::create('checklist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('checklist_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            $table->integer('quantity_planned')->nullable();
            $table->foreignId('unit_id_planned')->nullable()->constrained()->onDelete('set null');
            $table->boolean('was_bought')->default(false);
            $table->integer('quantity_bought')->nullable();
            $table->foreignId('unit_id_bought')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('place_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->decimal('total_price', 10, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checklist_items');
    }
};
