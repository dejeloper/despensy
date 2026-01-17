<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StateSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		// [code, name, type, color, icon]
		$states = [
			// Estados de Checklist
			['Abierta', 'CHECKLIST', '#4CAF50', '📋'],
			['En Progreso', 'CHECKLIST', '#2196F3', '⏳'],
			['Cerrada', 'CHECKLIST', '#9E9E9E', '✅'],
			['Cancelada', 'CHECKLIST', '#F44336', '❌'],
		];

		$data = array_map(fn($s) => [
			'name' => $s[0],
			'type' => $s[1],
			'color' => $s[2],
			'icon' => $s[3],
			'enabled' => true,
		], $states);

		DB::table('states')->insert($data);
	}
}
