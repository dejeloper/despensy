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
            ['Unidad', 'Und'],
            ['Par', 'Par'],
            ['Promoción', 'Promo'],
            ['Litro', 'L'],
            ['Mililitro', 'ml'],
            ['Kilogramo', 'Kg'],
            ['Gramo', 'g'],
            ['Libra', 'Lb'],
            ['Onza', 'Oz'],
            ['Galón', 'Gal'],
            ['Caja', 'Cja'],
            ['Paquete', 'Paq'],
            ['Docena', 'Doc'],
            ['Arroba', 'Arb'],
            ['Bulto', 'Blt'],
            ['Metro', 'm'],
            ['Centímetro', 'cm'],
            ['Milímetro', 'mm'],
            ['Metro cúbico', 'm³'],
            ['Metro cuadrado', 'm²'],
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
