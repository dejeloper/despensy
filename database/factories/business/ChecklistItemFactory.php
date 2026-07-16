<?php

namespace Database\Factories\business;

use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\business\ChecklistItem>
 */
class ChecklistItemFactory extends Factory
{
    protected $model = ChecklistItem::class;

    public function definition(): array
    {
        return [
            'checklist_id' => Checklist::factory(),
            'product_id' => Product::factory(),
            'quantity_planned' => $this->faker->numberBetween(1, 5),
            'unit_id_planned' => null,
            'was_bought' => false,
            'quantity_bought' => null,
            'unit_id_bought' => null,
            'place_id' => null,
            'unit_price' => null,
            'total_price' => null,
            'purchase_date' => null,
        ];
    }

    /**
     * Mark the item as already bought, with purchase data filled in.
     */
    public function bought(): static
    {
        return $this->state(function (array $attributes) {
            $quantity = $attributes['quantity_planned'] ?? $this->faker->numberBetween(1, 5);
            $unitPrice = $this->faker->randomFloat(2, 1000, 50000);

            return [
                'was_bought' => true,
                'quantity_bought' => $quantity,
                'unit_price' => $unitPrice,
                'total_price' => $unitPrice * $quantity,
                'purchase_date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            ];
        });
    }
}
