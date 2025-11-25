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
        Schema::create('checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('name')->nullable();
            $table->integer('total_estimado')->default(0);
            $table->integer('total_real')->default(0);
            $table->string('status')->default('ACTIVE'); // ACTIVE, COMPLETED
            $table->timestamps();
        });

        Schema::create('checklist_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('checklist_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained();
            $table->integer('reported_stock')->nullable();
            $table->unsignedBigInteger('place_suggested_id')->nullable();
            $table->unsignedBigInteger('unit_suggested_id')->nullable();
            $table->integer('quantity_planned')->nullable();
            $table->integer('quantity_bought')->nullable();
            $table->integer('price_paid')->nullable();
            $table->foreignId('place_id')->nullable()->constrained();
            $table->boolean('is_processed')->default(false);
            $table->timestamps();
        });

        Schema::table('checklist_details', function (Blueprint $table) {
            $table->foreign('place_suggested_id')->references('id')->on('places')->onDelete('set null');
            $table->foreign('unit_suggested_id')->references('id')->on('units')->onDelete('set null');
        });

        Schema::create('purchase_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('checklist_id')->nullable()->constrained();
            $table->foreignId('place_id')->nullable()->constrained();
            $table->integer('quantity');
            $table->integer('price');
            $table->integer('old_stock')->nullable();
            $table->integer('new_stock')->nullable();
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_histories');
        Schema::dropIfExists('checklist_details');
        Schema::dropIfExists('checklists');
    }
};
