<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlaceSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$places = [];

		for ($i = 1; $i <= 12; $i++) {
			$places[] = [
				'name' => 'Place ' . $i,
				'slug' => 'place-' . $i,
				'address' => 'Address ' . $i,
				'bg_color' => '#ffffff',
				'text_color' => '#000000',
				'note' => 'Nota de ejemplo ' . $i,
			];
		}

		DB::table('places')->insert($places);
	}
}
