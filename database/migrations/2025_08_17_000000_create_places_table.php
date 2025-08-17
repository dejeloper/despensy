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
		Schema::create('places', function (Blueprint $table) {
			$table->id();
			$table->string('name', 50)->unique();
			$table->string('short_name', 30)->unique();
			$table->string('address', 50)->nullable();
			$table->string('bg_color', 7)->default('#ffffff');
			$table->string('text_color', 7)->default('#000000');
			$table->string('note', 200)->nullable();
			$table->boolean('enabled')->default(true);
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('places');
	}
};
