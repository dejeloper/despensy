<?php

namespace Database\Factories\business;

use App\Models\business\Product;
use App\Models\business\Category;
use App\Models\business\Place;
use App\Models\business\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\business\Product>
 */
class ProductFactory extends Factory
{
	protected $model = Product::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$products = [
			// Frutas
			['Manzana', 'Manzana fresca y crujiente'],
			['Banana', 'Banana madura y dulce'],
			['Naranja', 'Naranja jugosa rica en vitamina C'],
			['Fresa', 'Fresas frescas de temporada'],
			['Uva', 'Uvas dulces sin semilla'],

			// Carnes
			['Pollo entero', 'Pollo fresco de granja'],
			['Carne de res', 'Carne de res premium'],
			['Cerdo', 'Carne de cerdo fresca'],
			['Pescado', 'Pescado fresco del día'],

			// Lácteos
			['Leche', 'Leche fresca entera'],
			['Queso', 'Queso fresco artesanal'],
			['Yogurt', 'Yogurt natural probiótico'],
			['Mantequilla', 'Mantequilla cremosa'],

			// Otros
			['Pan', 'Pan fresco recién horneado'],
			['Arroz', 'Arroz blanco de grano largo'],
			['Pasta', 'Pasta italiana de trigo'],
			['Aceite', 'Aceite de oliva extra virgen'],
			['Azúcar', 'Azúcar blanca refinada'],
		];

		$product = $this->faker->randomElement($products);

		return [
			'name' => $product[0] . ' ' . $this->faker->company(),
			'description' => $product[1] . '. ' . $this->faker->sentence(),
			'image' => $this->faker->optional(60)->imageUrl(400, 400, 'food'), // 60% probabilidad de tener imagen
			'category_id' => Category::factory(),
			'place_id' => Place::factory(),
			'unit_id' => Unit::factory(),
			'enabled' => $this->faker->boolean(85), // 85% probabilidad de estar habilitado
		];
	}

	/**
	 * Indicate that the product is disabled.
	 */
	public function disabled(): static
	{
		return $this->state(fn(array $attributes) => [
			'enabled' => false,
		]);
	}

	/**
	 * Create a product without an image.
	 */
	public function withoutImage(): static
	{
		return $this->state(fn(array $attributes) => [
			'image' => null,
		]);
	}

	/**
	 * Create a product with a specific image.
	 */
	public function withImage(string $imagePath): static
	{
		return $this->state(fn(array $attributes) => [
			'image' => $imagePath,
		]);
	}

	/**
	 * Create a product with existing relationships.
	 */
	public function withRelationships(int $categoryId, int $placeId, int $unitId): static
	{
		return $this->state(fn(array $attributes) => [
			'category_id' => $categoryId,
			'place_id' => $placeId,
			'unit_id' => $unitId,
		]);
	}

	/**
	 * Create a fruit product.
	 */
	public function fruit(): static
	{
		$fruits = [
			['Manzana Roja', 'Manzana roja fresca y crujiente'],
			['Banana Premium', 'Banana premium madura'],
			['Naranja Valencia', 'Naranja Valencia jugosa'],
			['Fresa Orgánica', 'Fresas orgánicas de temporada'],
			['Uva Verde', 'Uvas verdes sin semilla'],
			['Pera', 'Pera fresca y dulce'],
			['Piña', 'Piña tropical madura'],
			['Mango', 'Mango dulce y jugoso'],
		];

		$fruit = $this->faker->randomElement($fruits);

		return $this->state(fn(array $attributes) => [
			'name' => $fruit[0],
			'description' => $fruit[1],
		]);
	}

	/**
	 * Create a meat product.
	 */
	public function meat(): static
	{
		$meats = [
			['Pollo Entero', 'Pollo fresco de granja libre'],
			['Carne Molida', 'Carne molida de res premium'],
			['Chuleta de Cerdo', 'Chuleta de cerdo fresca'],
			['Pechuga de Pollo', 'Pechuga de pollo sin hueso'],
			['Costillas de Res', 'Costillas de res para asar'],
		];

		$meat = $this->faker->randomElement($meats);

		return $this->state(fn(array $attributes) => [
			'name' => $meat[0],
			'description' => $meat[1],
		]);
	}

	/**
	 * Create a dairy product.
	 */
	public function dairy(): static
	{
		$dairy = [
			['Leche Entera', 'Leche fresca entera pasteurizada'],
			['Queso Campesino', 'Queso campesino artesanal'],
			['Yogurt Natural', 'Yogurt natural con probióticos'],
			['Mantequilla', 'Mantequilla cremosa sin sal'],
			['Crema de Leche', 'Crema de leche espesa'],
		];

		$product = $this->faker->randomElement($dairy);

		return $this->state(fn(array $attributes) => [
			'name' => $product[0],
			'description' => $product[1],
		]);
	}
}
