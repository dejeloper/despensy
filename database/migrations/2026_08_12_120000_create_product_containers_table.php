<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('product_containers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('place_id')->nullable()->constrained('places')->onDelete('cascade');
            $table->foreignId('container_unit_id')->constrained('units')->onDelete('cascade');
            $table->decimal('content_quantity', 12, 4);
            $table->foreignId('content_unit_id')->constrained('units')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['product_id', 'place_id', 'container_unit_id'], 'product_containers_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_containers');
    }
};
