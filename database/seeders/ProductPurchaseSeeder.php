<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductPurchaseSeeder extends Seeder
{
    /**
     * Give every product that has no purchase yet a fake "bought" checklist
     * item, so the products list always has a last_price/last_purchase_date
     * to show. Safe to run more than once: only fills in the gaps.
     */
    public function run(): void
    {
        $productIds = DB::table('products')->pluck('id');

        $alreadyPurchased = DB::table('checklist_items')
            ->where('was_bought', true)
            ->pluck('product_id')
            ->unique();

        $pendingIds = $productIds->diff($alreadyPurchased)->values();

        if ($pendingIds->isEmpty()) {
            return;
        }

        $placeIds = DB::table('places')->pluck('id');
        $unitIds = DB::table('units')->pluck('id');
        $stateId = DB::table('states')->where('name', 'Cerrada')->value('id');

        $checklistId = DB::table('checklists')->insertGetId([
            'user_id' => 1,
            'name' => 'Compras históricas (seed)',
            'state_id' => $stateId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $data = $pendingIds->map(function ($productId) use ($checklistId, $placeIds, $unitIds) {
            $quantity = fake()->numberBetween(1, 4);
            $unitPrice = fake()->randomFloat(2, 1500, 45000);
            $purchaseDate = fake()->dateTimeBetween('-3 months', 'now');

            return [
                'checklist_id' => $checklistId,
                'product_id' => $productId,
                'quantity_planned' => $quantity,
                'unit_id_planned' => $unitIds->random(),
                'was_bought' => true,
                'quantity_bought' => $quantity,
                'unit_id_bought' => $unitIds->random(),
                'place_id' => $placeIds->random(),
                'unit_price' => $unitPrice,
                'total_price' => $unitPrice * $quantity,
                'purchase_date' => $purchaseDate->format('Y-m-d'),
                'created_at' => $purchaseDate,
                'updated_at' => $purchaseDate,
            ];
        })->toArray();

        DB::table('checklist_items')->insert($data);
    }
}
