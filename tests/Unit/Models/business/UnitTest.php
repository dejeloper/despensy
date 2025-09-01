<?php

use App\Models\business\Unit;

describe('Unit Model', function () {
	test('can create unit with factory', function () {
		$unit = Unit::factory()->create();

		expect($unit)->toBeInstanceOf(Unit::class)
			->and($unit->name)->toBeString()
			->and($unit->short_name)->toBeString()
			->and($unit->enabled)->toBeBool();
	});

	test('can create weight unit using factory', function () {
		$unit = Unit::factory()->weight()->create();

		expect($unit)->toBeInstanceOf(Unit::class)
			->and($unit->name)->toBeIn(['Gramo', 'Kilogramo', 'Libra', 'Onza', 'Tonelada']);
	});

	test('can create volume unit using factory', function () {
		$unit = Unit::factory()->volume()->create();

		expect($unit)->toBeInstanceOf(Unit::class)
			->and($unit->name)->toBeIn(['Litro', 'Mililitro', 'Galón']);
	});

	test('can create disabled unit using factory', function () {
		$unit = Unit::factory()->disabled()->create();

		expect($unit->enabled)->toBeFalse();
	});

	test('can create unit with specific names using factory', function () {
		$unit = Unit::factory()
			->withNames('Kilogramo', 'Kg')
			->create();

		expect($unit->name)->toBe('Kilogramo')
			->and($unit->short_name)->toBe('Kg');
	});

	test('has correct fillable attributes', function () {
		$unit = new Unit();
		$expected = ['name', 'short_name', 'enabled'];

		expect($unit->getFillable())->toBe($expected);
	});

	test('name is required', function () {
		expect(fn() => Unit::create([
			'short_name' => 'Kg',
			'enabled' => true
		]))->toThrow(\Illuminate\Database\QueryException::class);
	});

	test('short_name is required', function () {
		expect(fn() => Unit::create([
			'name' => 'Kilogramo',
			'enabled' => true
		]))->toThrow(\Illuminate\Database\QueryException::class);
	});

	test('can be disabled', function () {
		$unit = Unit::factory()->disabled()->create();

		expect($unit->enabled)->toBeFalse();
	});

	test('can update unit attributes', function () {
		$unit = Unit::factory()->create([
			'name' => 'Original Name',
			'short_name' => 'ON'
		]);

		$unit->update([
			'name' => 'Updated Name',
			'short_name' => 'UN'
		]);

		expect($unit->name)->toBe('Updated Name')
			->and($unit->short_name)->toBe('UN');
	});

	test('uses correct table name', function () {
		$unit = new Unit();

		expect($unit->getTable())->toBe('units');
	});
});
