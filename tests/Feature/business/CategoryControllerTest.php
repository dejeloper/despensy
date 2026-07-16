<?php

use App\Models\business\Category;
use App\Models\business\Product;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard/categories')->assertRedirect('/login');
});

test('authenticated user can view the categories list', function () {
    $user = User::factory()->create();
    Category::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard/categories')
        ->assertOk();
});

test('store creates a category', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/categories', [
            'name' => 'Lácteos',
            'icon' => '🥛',
            'bg_color' => '#FFFFFF',
            'text_color' => '#000000',
            'enabled' => true,
        ])
        ->assertRedirect(route('categories.index'));

    expect(Category::where('name', 'Lácteos')->exists())->toBeTrue();
});

test('store fails validation without a name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/categories', ['enabled' => true])
        ->assertSessionHasErrors('name');
});

test('update modifies an existing category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['name' => 'Original']);

    $this->actingAs($user)
        ->put("/dashboard/categories/{$category->id}", [
            'name' => 'Actualizada',
            'icon' => $category->icon,
            'bg_color' => $category->bg_color ?? '#FFFFFF',
            'text_color' => $category->text_color ?? '#000000',
            'enabled' => true,
        ])
        ->assertRedirect(route('categories.index'));

    expect($category->fresh()->name)->toBe('Actualizada');
});

test('destroy deletes a category not in use', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->delete("/dashboard/categories/{$category->id}")
        ->assertRedirect(route('categories.index'));

    expect(Category::find($category->id))->toBeNull();
});

test('destroy fails gracefully when the category is in use', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    Product::factory()->withRelationships($category->id)->create();

    $this->actingAs($user)
        ->delete("/dashboard/categories/{$category->id}")
        ->assertRedirect(route('categories.index'))
        ->assertSessionHas('error');

    expect(Category::find($category->id))->not->toBeNull();
});
