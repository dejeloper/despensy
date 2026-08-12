<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('checklist_items', function (Blueprint $table) {
            $table->decimal('quantity_planned', 10, 2)->nullable()->change();
            $table->decimal('quantity_at_home', 10, 2)->nullable()->change();
            $table->decimal('quantity_bought', 10, 2)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('checklist_items', function (Blueprint $table) {
            $table->integer('quantity_planned')->nullable()->change();
            $table->integer('quantity_at_home')->nullable()->change();
            $table->integer('quantity_bought')->nullable()->change();
        });
    }
};
