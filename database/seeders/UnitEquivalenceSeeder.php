<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitEquivalenceSeeder extends Seeder
{
    public function run(): void
    {
        $equivalences = [
            'Kilogramo' => ['Gramo', 1000],
            'Libra' => ['Gramo', 500],
            'Arroba' => ['Libra', 25],
            'Onza' => ['Gramo', 28.35],
        ];

        $ids = DB::table('units')->pluck('id', 'name');

        $rows = [];

        foreach ($equivalences as $name => [$parentName, $factor]) {
            $rows[] = [
                'unit_id' => $ids[$name],
                'parent_unit_id' => $ids[$parentName],
                'factor' => $factor,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('unit_equivalences')->insert($rows);
    }
}
