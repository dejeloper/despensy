<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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

        foreach ($units as $unit) {
            Unit::create([
                'name' => $unit[0],
                'short_name' => $unit[1],
                'enabled' => true
            ]);
        }
    }
}
