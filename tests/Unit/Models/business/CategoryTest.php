<?php

use App\Models\business\Category;

describe('Category Model', function () {
	test('can create category with factory', function () {
		$category = Category::factory()->create();

		expect($category)->toBeInstanceOf(Category::class)
			->and($category->name)->toBeString()
			->and($category->icon)->toBeString()
			->and($category->bg_color)->toMatch('/^#[0-9a-fA-F]{6}$/')
			->and($category->text_color)->toMatch('/^#[0-9a-fA-F]{6}$/')
			->and($category->enabled)->toBeBool();
	});

	test('can create category with specific attributes using factory', function () {
		$category = Category::factory()
			->withName('Test Category')
			->withColors('#ff0000', '#ffffff')
			->create();

		expect($category->name)->toBe('Test Category')
			->and($category->bg_color)->toBe('#ff0000')
			->and($category->text_color)->toBe('#ffffff');
	});

	test('can create disabled category using factory', function () {
		$category = Category::factory()->disabled()->create();

		expect($category->enabled)->toBeFalse();
	});

	test('can create category with basic attributes', function () {
		$category = Category::create([
			'name' => 'Electronics',
			'icon' => 'fas fa-laptop',
			'bg_color' => '#3498db',
			'text_color' => '#ffffff',
			'enabled' => true
		]);

		expect($category)->toBeInstanceOf(Category::class)
			->and($category->name)->toBe('Electronics')
			->and($category->icon)->toBe('fas fa-laptop')
			->and($category->bg_color)->toBe('#3498db')
			->and($category->text_color)->toBe('#ffffff')
			->and($category->enabled)->toBeTrue();
	});

	test('has correct fillable attributes', function () {
		$category = new Category();
		$expected = ['name', 'icon', 'bg_color', 'text_color', 'enabled'];

		expect($category->getFillable())->toBe($expected);
	});

	test('name is required', function () {
		expect(fn() => Category::create([
			'icon' => 'fas fa-laptop',
			'bg_color' => '#3498db',
			'text_color' => '#ffffff',
			'enabled' => true
		]))->toThrow(\Illuminate\Database\QueryException::class);
	});

	test('can be disabled', function () {
		$category = Category::create([
			'name' => 'Disabled Category',
			'icon' => 'fas fa-ban',
			'bg_color' => '#grey',
			'text_color' => '#black',
			'enabled' => false
		]);

		expect($category->enabled)->toBeFalse();
	});

	test('can update category attributes', function () {
		$category = Category::factory()->create([
			'name' => 'Original Name',
			'icon' => 'fas fa-old'
		]);

		$category->update([
			'name' => 'Updated Name',
			'icon' => 'fas fa-new'
		]);

		expect($category->name)->toBe('Updated Name')
			->and($category->icon)->toBe('fas fa-new');
	});

	test('uses correct table name', function () {
		$category = new Category();

		expect($category->getTable())->toBe('categories');
	});
});
