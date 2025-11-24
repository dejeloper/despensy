<?php

use App\Http\Controllers\business\CategoryController;
use App\Http\Controllers\business\PlaceController;
use App\Http\Controllers\business\ProductController;
use App\Http\Controllers\business\UnitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Categories routes
    Route::get('dashboard/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('dashboard/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('dashboard/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('dashboard/categories/{category}', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('dashboard/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('dashboard/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Places routes
    Route::get('dashboard/places', [PlaceController::class, 'index'])->name('places.index');
    Route::get('dashboard/places/create', [PlaceController::class, 'create'])->name('places.create');
    Route::post('dashboard/places', [PlaceController::class, 'store'])->name('places.store');
    Route::get('dashboard/places/{place}', [PlaceController::class, 'edit'])->name('places.edit');
    Route::put('dashboard/places/{place}', [PlaceController::class, 'update'])->name('places.update');
    Route::delete('dashboard/places/{place}', [PlaceController::class, 'destroy'])->name('places.destroy');

    // Units routes
    Route::get('dashboard/units', [UnitController::class, 'index'])->name('units.index');
    Route::get('dashboard/units/create', [UnitController::class, 'create'])->name('units.create');
    Route::post('dashboard/units', [UnitController::class, 'store'])->name('units.store');
    Route::get('dashboard/units/{unit}', [UnitController::class, 'edit'])->name('units.edit');
    Route::put('dashboard/units/{unit}', [UnitController::class, 'update'])->name('units.update');
    Route::delete('dashboard/units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');

    // Products routes
    Route::get('dashboard/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('dashboard/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('dashboard/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('dashboard/products/{product}', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('dashboard/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('dashboard/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Consumers routes
    Route::get('dashboard/consumers', [\App\Http\Controllers\business\ConsumerController::class, 'index'])->name('consumers.index');
    Route::get('dashboard/consumers/create', [\App\Http\Controllers\business\ConsumerController::class, 'create'])->name('consumers.create');
    Route::post('dashboard/consumers', [\App\Http\Controllers\business\ConsumerController::class, 'store'])->name('consumers.store');
    Route::get('dashboard/consumers/{consumer}', [\App\Http\Controllers\business\ConsumerController::class, 'edit'])->name('consumers.edit');
    Route::put('dashboard/consumers/{consumer}', [\App\Http\Controllers\business\ConsumerController::class, 'update'])->name('consumers.update');
    Route::delete('dashboard/consumers/{consumer}', [\App\Http\Controllers\business\ConsumerController::class, 'destroy'])->name('consumers.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
