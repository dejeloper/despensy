<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            ['Arroba', 'Arb'],
            ['Bulto', 'Blt'],
            ['Caja', 'Cja'],
            ['Centímetro', 'cm'],
            ['Decena', 'Dec'],
            ['Docena', 'Doc'],
            ['Galón', 'Gal'],
            ['Gramo', 'g'],
            ['Kilogramo', 'Kg'],
            ['Libra', 'Lb'],
            ['Litro', 'L'],
            ['Mililitro', 'ml'],
            ['Milímetro', 'mm'],
            ['Metro', 'm'],
            ['Metro cuadrado', 'm²'],
            ['Metro cúbico', 'm³'],
            ['Onza', 'Oz'],
            ['Paquete', 'Paq'],
            ['Par', 'Par'],
            ['Promoción', 'Promo'],
            ['Unidad', 'Und'],
        ];


        $data = array_map(fn($u) => [
            'name'          => $u[0],
            'short_name'    => $u[1],
            'enabled'       => true,
        ], $units);

        DB::table('units')->insert($data);
    }
}
