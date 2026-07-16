<?php

use App\Models\business\Category;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Product;
use App\Models\User;

beforeEach(function () {
    seedChecklistStates();
});

test('guests are redirected to the login page', function () {
    $this->get('/dashboard/products')->assertRedirect('/login');
});

test('authenticated user can view the products list', function () {
    $user = User::factory()->create();
    Product::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard/products')
        ->assertOk();
});

test('store creates a product', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/products', [
            'name' => 'Producto de prueba',
            'category_id' => $category->id,
            'enabled' => true,
        ])
        ->assertRedirect(route('products.index'));

    expect(Product::where('name', 'Producto de prueba')->exists())->toBeTrue();
});

test('store fails validation without a category', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/products', ['name' => 'Producto sin categoría', 'enabled' => true])
        ->assertSessionHasErrors('category_id');
});

test('update modifies an existing product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['name' => 'Original']);

    $this->actingAs($user)
        ->put("/dashboard/products/{$product->id}", [
            'name' => 'Actualizado',
            'category_id' => $product->category_id,
            'enabled' => true,
        ])
        ->assertRedirect(route('products.index'));

    expect($product->fresh()->name)->toBe('Actualizado');
});

test('destroy deletes a product not in use', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->delete("/dashboard/products/{$product->id}")
        ->assertRedirect(route('products.index'));

    expect(Product::find($product->id))->toBeNull();
});

test('destroy fails gracefully when the product has purchase history', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $checklist = Checklist::factory()->open()->create();
    ChecklistItem::factory()->create(['checklist_id' => $checklist->id, 'product_id' => $product->id]);

    $this->actingAs($user)
        ->delete("/dashboard/products/{$product->id}")
        ->assertRedirect(route('products.index'))
        ->assertSessionHas('error');

    expect(Product::find($product->id))->not->toBeNull();
});
