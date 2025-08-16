<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('dashboard/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('dashboard/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('dashboard/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('dashboard/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('dashboard/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('dashboard/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('dashboard/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
