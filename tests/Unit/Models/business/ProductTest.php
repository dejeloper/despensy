<?php

use App\Models\business\Category;
use App\Models\business\Product;

describe('Product Model', function () {
    test('can create product with factory', function () {
        $product = Product::factory()->create();

        expect($product)->toBeInstanceOf(Product::class)
            ->and($product->name)->toBeString()
            ->and($product->description)->toBeString()
            ->and($product->category_id)->toBeInt()
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

    test('can create product with existing category using factory', function () {
        $category = Category::factory()->create();

        $product = Product::factory()
            ->withRelationships($category->id)
            ->create();

        expect($product->category_id)->toBe($category->id);
    });

    test('can create product with basic attributes', function () {
        $category = Category::factory()->create();

        $product = Product::create([
            'name' => 'iPhone 15',
            'description' => 'Latest iPhone model',
            'image' => 'iphone15.jpg',
            'category_id' => $category->id,
            'enabled' => true,
        ]);

        expect($product)->toBeInstanceOf(Product::class)
            ->and($product->name)->toBe('iPhone 15')
            ->and($product->description)->toBe('Latest iPhone model')
            ->and($product->image)->toBe('iphone15.jpg')
            ->and($product->enabled)->toBeTrue();
    });

    test('has correct fillable attributes', function () {
        $product = new Product;
        $expected = [
            'name',
            'description',
            'image',
            'category_id',
            'enabled',
        ];

        expect($product->getFillable())->toBe($expected);
    });

    test('belongs to category relationship', function () {
        $category = Category::factory()->create(['name' => 'Electronics']);

        $product = Product::factory()
            ->withRelationships($category->id)
            ->create();

        expect($product->category)->toBeInstanceOf(Category::class)
            ->and($product->category->name)->toBe('Electronics');
    });

    test('name is required', function () {
        expect(fn () => Product::create([
            'description' => 'Test Description',
            'category_id' => 1,
            'enabled' => true,
        ]))->toThrow(\Illuminate\Database\QueryException::class);
    });

    test('can be disabled', function () {
        $product = Product::factory()->disabled()->create();

        expect($product->enabled)->toBeFalse();
    });

    test('uses correct table name', function () {
        $product = new Product;

        expect($product->getTable())->toBe('products');
    });
});
