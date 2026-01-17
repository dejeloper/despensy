<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ChecklistSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::parse('2026-01-17 00:00:00');
        $purchaseDate = Carbon::parse('2026-01-17');

        // Crear checklist 
        $checklistId = DB::table('checklists')->insertGetId([
            'user_id' => 1,
            'name' => 'Mes de Enero - Prueba',
            'state_id' => 1, // Estado "Abierta" 
            'created_at' => $now,
            'updated_at' =>  $now,
        ]);

        // [checklist_id, product_id, qty_planned, unit_planned, was_bought, qty_bought, unit_bought, place_id, unit_price, total_price] 
        $items = [
            // Proteínas
            [$checklistId, 80, 1, 9, true, 1, 9, 7, 12000, 12000], // Pechuga pollo
            [$checklistId, 78, 1, 9, true, 1, 9, 7, 16000, 16000], // Carne molida
            [$checklistId, 72, 4, 21, true, 4, 21, 5, 4500, 18000], // Atún

            // Huevos y lácteos
            [$checklistId, 35, 1, 6, true, 1, 6, 7, 15000, 15000], // Huevos
            [$checklistId, 42, 2, 21, true, 2, 21, 4, 4200, 8400], // Leche
            [$checklistId, 102, 1, 21, true, 1, 21, 4, 3800, 3800], // Crema de leche

            // Granos y básicos
            [$checklistId, 4, 2, 9, true, 2, 9, 7, 4200, 8400], // Arroz
            [$checklistId, 26, 1, 9, true, 1, 9, 7, 6500, 6500], // Frijol

            // Mascota
            [$checklistId, 15, 1, 21, true, 1, 21, 10, 18000, 18000], // Alimento mascota
        ];

        $data = array_map(fn($item) => [
            'checklist_id' => $item[0],
            'product_id' => $item[1],
            'quantity_planned' => $item[2],
            'unit_id_planned' => $item[3],
            'was_bought' => $item[4],
            'quantity_bought' => $item[5],
            'unit_id_bought' => $item[6],
            'place_id' => $item[7],
            'unit_price' => $item[8],
            'total_price' => $item[9],
            'purchase_date' => $purchaseDate,
            'created_at' => $now,
            'updated_at' => $now,
        ], $items);

        DB::table('checklist_items')->insert($data);
    }
}
