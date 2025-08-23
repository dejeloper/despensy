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

		$places = [
			['Alkosto', 'Alkosto', 'Bogotá', '#E65100', '#FFF8E1', ''],
			['Almacenes Éxito', 'Éxito', 'Bogotá', '#FFEB3B', '#212121', ''],
			['Amigos 4 Patas', '4Patas', 'Mosquera', '#2196F3', '#FFFFFF', ''],
			['Ara', 'Ara', 'Mosquera', '#FF5722', '#FFFDE7', ''],
			['D1', 'D1', 'Mosquera', '#F44336', '#FFFFFF', ''],
			['Dollarcity', 'Dollarcity', 'Mosquera', '#2E7D32', '#FFEB3B', ''],
			['Don Camilo', 'DonCamilo', 'Mosquera', '#FFC107', '#212121', ''],
			['Droguería Guayacán', 'Drogería', 'Mosquera', '#2196F3', '#E3F2FD', ''],
			['Homecenter', 'Homecenter', 'Bogotá', '#1565C0', '#FFFFFF', ''],
			['Laika', 'Laika', 'Mosquera', '#9C27B0', '#F3E5F5', ''],
			['Maix', 'Maix', 'Mosquera', '#EFA624', '#212121', ''],
			['Mercado Zapatoca', 'Zapatoca', 'Mosquera Centro', '#388E3C', '#FFEB3B', ''],
			['Metro Mosquera', 'Metro', 'Mosquera', '#FFEB3B', '#D32F2F', ''],
			['Olímpica', 'Olímpica', 'Mosquera', '#F44336', '#FFF8E1', ''],
			['Pet Pawradise', 'Pawradise', 'Mosquera', '#03A9F4', '#212121', ''],
			['Plaza Paloquemado', 'Paloquemado', 'Bogotá Paloquemado', '#FFFFFF', '#FF9800', ''],
			['Salsamentaria', 'Salsa', 'Mosquera',  '#FFFFFF', '#884844', ''],
		];

		$data = array_map(fn($p) => [
			'name'       => $p[0],
			'short_name' => $p[1],
			'address'    => $p[2],
			'bg_color'   => $p[3],
			'text_color' => $p[4],
			'note'       => $p[5],
		], $places);

		DB::table('places')->insert($data);
	}
}
