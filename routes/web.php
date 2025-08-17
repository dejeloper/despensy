<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PlaceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('dashboard/places', [PlaceController::class, 'index'])->name('places.index');
    Route::get('dashboard/places/create', [PlaceController::class, 'create'])->name('places.create');
    Route::post('dashboard/places', [PlaceController::class, 'store'])->name('places.store');
    Route::get('dashboard/places/{place}', [PlaceController::class, 'show'])->name('places.show');
    Route::get('dashboard/places/{place}/edit', [PlaceController::class, 'edit'])->name('places.edit');
    Route::put('dashboard/places/{place}', [PlaceController::class, 'update'])->name('places.update');
    Route::delete('dashboard/places/{place}', [PlaceController::class, 'destroy'])->name('places.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
