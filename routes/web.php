<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\UnitController;
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
    Route::get('dashboard/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('dashboard/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('dashboard/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('dashboard/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Places routes
    Route::get('dashboard/places', [PlaceController::class, 'index'])->name('places.index');
    Route::get('dashboard/places/create', [PlaceController::class, 'create'])->name('places.create');
    Route::post('dashboard/places', [PlaceController::class, 'store'])->name('places.store');
    Route::get('dashboard/places/{place}', [PlaceController::class, 'show'])->name('places.show');
    Route::get('dashboard/places/{place}/edit', [PlaceController::class, 'edit'])->name('places.edit');
    Route::put('dashboard/places/{place}', [PlaceController::class, 'update'])->name('places.update');
    Route::delete('dashboard/places/{place}', [PlaceController::class, 'destroy'])->name('places.destroy');

    // Units routes
    Route::get('dashboard/units', [UnitController::class, 'index'])->name('units.index');
    Route::get('dashboard/units/create', [UnitController::class, 'create'])->name('units.create');
    Route::post('dashboard/units', [UnitController::class, 'store'])->name('units.store');
    Route::get('dashboard/units/{unit}', [UnitController::class, 'show'])->name('units.show');
    Route::get('dashboard/units/{unit}/edit', [UnitController::class, 'edit'])->name('units.edit');
    Route::put('dashboard/units/{unit}', [UnitController::class, 'update'])->name('units.update');
    Route::delete('dashboard/units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
