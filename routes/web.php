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

    // Categories routes - Using resource controller
    Route::prefix('dashboard')->group(function () {
        Route::resource('categories', CategoryController::class)->except(['show']);

        // Places routes - Using resource controller
        Route::resource('places', PlaceController::class)->except(['show']);

        // Units routes - Using resource controller
        Route::resource('units', UnitController::class)->except(['show']);

        // Products routes - Using resource controller
        Route::resource('products', ProductController::class)->except(['show']);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
