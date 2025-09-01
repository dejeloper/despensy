<?php

namespace Database\Factories\business;

use App\Models\business\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\business\Unit>
 */
class UnitFactory extends Factory
{
	protected $model = Unit::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
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
			['Onza', 'oz'],
			['Paquete', 'Paq'],
			['Par', 'Par'],
			['Pieza', 'Pza'],
			['Rollo', 'Rll'],
			['Saco', 'Sco'],
			['Tonelada', 'Ton'],
			['Unidad', 'Und'],
			['Yarda', 'yd'],
		];

		$unit = $this->faker->randomElement($units);

		return [
			'name' => $unit[0] . ' ' . $this->faker->randomNumber(2),
			'short_name' => $unit[1] . $this->faker->randomNumber(1),
			'enabled' => $this->faker->boolean(95), // 95% probabilidad de estar habilitado
		];
	}

	/**
	 * Indicate that the unit is disabled.
	 */
	public function disabled(): static
	{
		return $this->state(fn(array $attributes) => [
			'enabled' => false,
		]);
	}

	/**
	 * Create a unit with specific names.
	 */
	public function withNames(string $name, string $shortName): static
	{
		return $this->state(fn(array $attributes) => [
			'name' => $name,
			'short_name' => $shortName,
		]);
	}

	/**
	 * Create weight units.
	 */
	public function weight(): static
	{
		$weightUnits = [
			['Gramo', 'g'],
			['Kilogramo', 'Kg'],
			['Libra', 'Lb'],
			['Onza', 'oz'],
			['Tonelada', 'Ton'],
		];

		$unit = $this->faker->randomElement($weightUnits);

		return $this->state(fn(array $attributes) => [
			'name' => $unit[0],
			'short_name' => $unit[1],
		]);
	}

	/**
	 * Create volume units.
	 */
	public function volume(): static
	{
		$volumeUnits = [
			['Litro', 'L'],
			['Mililitro', 'ml'],
			['Galón', 'Gal'],
		];

		$unit = $this->faker->randomElement($volumeUnits);

		return $this->state(fn(array $attributes) => [
			'name' => $unit[0],
			'short_name' => $unit[1],
		]);
	}
}
