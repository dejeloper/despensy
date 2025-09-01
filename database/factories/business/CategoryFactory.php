<?php

namespace Database\Factories\business;

use App\Models\business\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\business\Category>
 */
class CategoryFactory extends Factory
{
	protected $model = Category::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$categories = [
			['Frutas', '🍎', '#ffadad', '#000000'],
			['Verduras', '🥦', '#b5e48c', '#000000'],
			['Carnes', '🥩', '#ff6b6b', '#ffffff'],
			['Pollo', '🍗', '#f4a261', '#000000'],
			['Pescado', '🐟', '#90e0ef', '#000000'],
			['Mariscos', '🦐', '#ffb5a7', '#000000'],
			['Panadería', '🥖', '#ffe5b4', '#000000'],
			['Lácteos', '🥛', '#e0fbfc', '#000000'],
			['Quesos', '🧀', '#fff1a8', '#000000'],
			['Huevos', '🥚', '#faf3dd', '#000000'],
			['Cereales', '🥣', '#ffe066', '#000000'],
			['Legumbres', '🫘', '#d9ed92', '#000000'],
			['Aceites', '🫒', '#b5c99a', '#000000'],
			['Pasta', '🍝', '#ffd97d', '#000000'],
			['Arroz', '🍚', '#f8edeb', '#000000'],
			['Especias', '🌶️', '#ffb4a2', '#000000'],
			['Dulces', '🍭', '#f7b7a3', '#000000'],
			['Snacks', '🍿', '#ffe66d', '#000000'],
		];

		$category = $this->faker->randomElement($categories);

		return [
			'name' => $category[0] . ' ' . $this->faker->randomNumber(3),
			'icon' => $category[1],
			'bg_color' => $category[2],
			'text_color' => $category[3],
			'enabled' => $this->faker->boolean(90), // 90% probabilidad de estar habilitado
		];
	}

	/**
	 * Indicate that the category is disabled.
	 */
	public function disabled(): static
	{
		return $this->state(fn(array $attributes) => [
			'enabled' => false,
		]);
	}

	/**
	 * Create a category with specific colors.
	 */
	public function withColors(string $bgColor, string $textColor): static
	{
		return $this->state(fn(array $attributes) => [
			'bg_color' => $bgColor,
			'text_color' => $textColor,
		]);
	}

	/**
	 * Create a category with a specific name.
	 */
	public function withName(string $name): static
	{
		return $this->state(fn(array $attributes) => [
			'name' => $name,
		]);
	}
}
