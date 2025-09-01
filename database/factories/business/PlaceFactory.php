<?php

namespace Database\Factories\business;

use App\Models\business\Place;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\business\Place>
 */
class PlaceFactory extends Factory
{
	protected $model = Place::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$places = [
			['Alkosto', 'Alkosto', 'Bogotá', '#E65100', '#FFF8E1'],
			['Almacenes Éxito', 'Éxito', 'Bogotá', '#FFEB3B', '#212121'],
			['Ara', 'Ara', 'Mosquera', '#FF5722', '#FFFDE7'],
			['D1', 'D1', 'Mosquera', '#F44336', '#FFFFFF'],
			['Dollarcity', 'Dollarcity', 'Mosquera', '#2E7D32', '#FFEB3B'],
			['Homecenter', 'Homecenter', 'Bogotá', '#1565C0', '#FFFFFF'],
			['Metro', 'Metro', 'Mosquera', '#FFEB3B', '#D32F2F'],
			['Olímpica', 'Olímpica', 'Mosquera', '#F44336', '#FFF8E1'],
		];

		$place = $this->faker->randomElement($places);
		$randomSuffix = $this->faker->randomNumber(2);

		return [
			'name' => $place[0] . ' ' . $randomSuffix,
			'short_name' => $place[1] . $randomSuffix,
			'address' => $this->faker->streetAddress() . ', ' . $place[2],
			'bg_color' => $place[3],
			'text_color' => $place[4],
			'note' => $this->faker->optional(70)->sentence(), // 70% probabilidad de tener nota
			'enabled' => $this->faker->boolean(90), // 90% probabilidad de estar habilitado
		];
	}

	/**
	 * Indicate that the place is disabled.
	 */
	public function disabled(): static
	{
		return $this->state(fn(array $attributes) => [
			'enabled' => false,
		]);
	}

	/**
	 * Create a place with specific colors.
	 */
	public function withColors(string $bgColor, string $textColor): static
	{
		return $this->state(fn(array $attributes) => [
			'bg_color' => $bgColor,
			'text_color' => $textColor,
		]);
	}

	/**
	 * Create a place with a specific location.
	 */
	public function inLocation(string $city): static
	{
		return $this->state(fn(array $attributes) => [
			'address' => $this->faker->streetAddress() . ', ' . $city,
		]);
	}

	/**
	 * Create a place with a note.
	 */
	public function withNote(string $note): static
	{
		return $this->state(fn(array $attributes) => [
			'note' => $note,
		]);
	}

	/**
	 * Create a place without a note.
	 */
	public function withoutNote(): static
	{
		return $this->state(fn(array $attributes) => [
			'note' => null,
		]);
	}

	/**
	 * Create a supermarket type place.
	 */
	public function supermarket(): static
	{
		$supermarkets = [
			['Éxito', 'Éxito', '#FFEB3B', '#212121'],
			['D1', 'D1', '#F44336', '#FFFFFF'],
			['Ara', 'Ara', '#FF5722', '#FFFDE7'],
			['Olímpica', 'Olímpica', '#F44336', '#FFF8E1'],
		];

		$supermarket = $this->faker->randomElement($supermarkets);

		return $this->state(fn(array $attributes) => [
			'name' => $supermarket[0] . ' ' . $this->faker->city(),
			'short_name' => $supermarket[1],
			'bg_color' => $supermarket[2],
			'text_color' => $supermarket[3],
			'note' => 'Supermercado de cadena',
		]);
	}
}
