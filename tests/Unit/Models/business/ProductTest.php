<?php

use App\Models\business\Product;
use App\Models\business\Category;
use App\Models\business\Place;
use App\Models\business\Unit;

describe('Product Model', function () {
	test('can create product with factory', function () {
		$product = Product::factory()->create();

		expect($product)->toBeInstanceOf(Product::class)
			->and($product->name)->toBeString()
			->and($product->description)->toBeString()
			->and($product->category_id)->toBeInt()
			->and($product->place_id)->toBeInt()
			->and($product->unit_id)->toBeInt()
			->and($product->enabled)->toBeBool();
	});

	test('can create product with specific type using factory', function () {
		$fruit = Product::factory()->fruit()->create();
		$meat = Product::factory()->meat()->create();
		$dairy = Product::factory()->dairy()->create();

		expect($fruit)->toBeInstanceOf(Product::class)
			->and($meat)->toBeInstanceOf(Product::class)
			->and($dairy)->toBeInstanceOf(Product::class);
	});

	test('can create disabled product using factory', function () {
		$product = Product::factory()->disabled()->create();

		expect($product->enabled)->toBeFalse();
	});

	test('can create product without image using factory', function () {
		$product = Product::factory()->withoutImage()->create();

		expect($product->image)->toBeNull();
	});

	test('can create product with existing relationships using factory', function () {
		$category = Category::factory()->create();
		$place = Place::factory()->create();
		$unit = Unit::factory()->create();

		$product = Product::factory()
			->withRelationships($category->id, $place->id, $unit->id)
			->create();

		expect($product->category_id)->toBe($category->id)
			->and($product->place_id)->toBe($place->id)
			->and($product->unit_id)->toBe($unit->id);
	});

	test('can create product with basic attributes', function () {
		// Crear las dependencias usando factories
		$category = Category::factory()->create();
		$place = Place::factory()->create();
		$unit = Unit::factory()->create();

		$product = Product::create([
			'name' => 'iPhone 15',
			'description' => 'Latest iPhone model',
			'image' => 'iphone15.jpg',
			'category_id' => $category->id,
			'place_id' => $place->id,
			'unit_id' => $unit->id,
			'enabled' => true
		]);

		expect($product)->toBeInstanceOf(Product::class)
			->and($product->name)->toBe('iPhone 15')
			->and($product->description)->toBe('Latest iPhone model')
			->and($product->image)->toBe('iphone15.jpg')
			->and($product->enabled)->toBeTrue();
	});

	test('has correct fillable attributes', function () {
		$product = new Product();
		$expected = [
			'name',
			'description',
			'image',
			'category_id',
			'place_id',
			'unit_id',
			'enabled'
		];

		expect($product->getFillable())->toBe($expected);
	});

	test('belongs to category relationship', function () {
		$category = Category::factory()->create(['name' => 'Electronics']);
		$place = Place::factory()->create();
		$unit = Unit::factory()->create();

		$product = Product::factory()
			->withRelationships($category->id, $place->id, $unit->id)
			->create();

		expect($product->category)->toBeInstanceOf(Category::class)
			->and($product->category->name)->toBe('Electronics');
	});

	test('belongs to place relationship exists', function () {
		$product = new Product();

		expect($product->place())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
	});

	test('belongs to unit relationship exists', function () {
		$product = new Product();

		expect($product->unit())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
	});

	test('name is required', function () {
		expect(fn() => Product::create([
			'description' => 'Test Description',
			'category_id' => 1,
			'place_id' => 1,
			'unit_id' => 1,
			'enabled' => true
		]))->toThrow(\Illuminate\Database\QueryException::class);
	});

	test('can be disabled', function () {
		$product = Product::factory()->disabled()->create();

		expect($product->enabled)->toBeFalse();
	});

	test('uses correct table name', function () {
		$product = new Product();

		expect($product->getTable())->toBe('products');
	});
});
