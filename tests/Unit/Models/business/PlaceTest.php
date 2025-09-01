<?php

use App\Models\business\Place;

describe('Place Model', function () {
	test('can create place with factory', function () {
		$place = Place::factory()->create();

		expect($place)->toBeInstanceOf(Place::class)
			->and($place->name)->toBeString()
			->and($place->short_name)->toBeString()
			->and($place->address)->toBeString()
			->and($place->bg_color)->toMatch('/^#[0-9a-fA-F]{6}$/')
			->and($place->text_color)->toMatch('/^#[0-9a-fA-F]{6}$/')
			->and($place->enabled)->toBeBool();
	});

	test('can create supermarket place using factory', function () {
		$place = Place::factory()->supermarket()->create();

		expect($place)->toBeInstanceOf(Place::class)
			->and($place->note)->toBe('Supermercado de cadena');
	});

	test('can create disabled place using factory', function () {
		$place = Place::factory()->disabled()->create();

		expect($place->enabled)->toBeFalse();
	});

	test('can create place with specific colors using factory', function () {
		$place = Place::factory()
			->withColors('#ff0000', '#ffffff')
			->create();

		expect($place->bg_color)->toBe('#ff0000')
			->and($place->text_color)->toBe('#ffffff');
	});

	test('can create place in specific location using factory', function () {
		$place = Place::factory()
			->inLocation('Medellín')
			->create();

		expect($place->address)->toContain('Medellín');
	});

	test('can create place with note using factory', function () {
		$place = Place::factory()
			->withNote('Test note for this place')
			->create();

		expect($place->note)->toBe('Test note for this place');
	});

	test('can create place without note using factory', function () {
		$place = Place::factory()->withoutNote()->create();

		expect($place->note)->toBeNull();
	});

	test('has correct fillable attributes', function () {
		$place = new Place();
		$expected = [
			'name',
			'short_name',
			'address',
			'bg_color',
			'text_color',
			'note',
			'enabled'
		];

		expect($place->getFillable())->toBe($expected);
	});

	test('name is required', function () {
		expect(fn() => Place::create([
			'short_name' => 'Test',
			'address' => 'Test Address',
			'bg_color' => '#ffffff',
			'text_color' => '#000000',
			'enabled' => true
		]))->toThrow(\Illuminate\Database\QueryException::class);
	});

	test('short_name is required', function () {
		expect(fn() => Place::create([
			'name' => 'Test Place',
			'address' => 'Test Address',
			'bg_color' => '#ffffff',
			'text_color' => '#000000',
			'enabled' => true
		]))->toThrow(\Illuminate\Database\QueryException::class);
	});

	test('can be disabled', function () {
		$place = Place::factory()->disabled()->create();

		expect($place->enabled)->toBeFalse();
	});

	test('can update place attributes', function () {
		$place = Place::factory()->create([
			'name' => 'Original Name',
			'short_name' => 'ON'
		]);

		$place->update([
			'name' => 'Updated Name',
			'short_name' => 'UN'
		]);

		expect($place->name)->toBe('Updated Name')
			->and($place->short_name)->toBe('UN');
	});

	test('note is optional', function () {
		$place = Place::factory()->withoutNote()->create();

		expect($place->note)->toBeNull();
	});

	test('uses correct table name', function () {
		$place = new Place();

		expect($place->getTable())->toBe('places');
	});
});
