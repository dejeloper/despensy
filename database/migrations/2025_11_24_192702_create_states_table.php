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
		Schema::create('states', function (Blueprint $table) {
			$table->id();
			$table->string('name', 50);
			$table->string('type', 20);
			$table->string('color', 7)->nullable();
			$table->string('icon')->nullable();
			$table->boolean('enabled')->default(true);
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('states');
	}
};
