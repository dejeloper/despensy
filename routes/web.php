<?php

use App\Http\Controllers\business\CategoryController;
use App\Http\Controllers\business\ChecklistController;
use App\Http\Controllers\business\ChecklistItemController;
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

        // Checklists routes
        Route::get('checklists', [ChecklistController::class, 'index'])->name('checklists.index');
        Route::get('checklists/active', [ChecklistController::class, 'active'])->name('checklists.active');
        Route::post('checklists', [ChecklistController::class, 'store'])->name('checklists.store');
        Route::get('checklists/{checklist}', [ChecklistController::class, 'show'])->name('checklists.show');
        Route::post('checklists/{checklist}/complete', [ChecklistController::class, 'complete'])->name('checklists.complete');
        Route::post('checklists/{checklist}/cancel', [ChecklistController::class, 'cancel'])->name('checklists.cancel');

        // Checklist items routes
        Route::post('checklists/{checklist}/items', [ChecklistItemController::class, 'store'])->name('checklist-items.store');
        Route::delete('checklists/{checklist}/items/{item}', [ChecklistItemController::class, 'destroy'])->name('checklist-items.destroy');
        Route::patch('checklist-items/{item}/mark-bought', [ChecklistItemController::class, 'markBought'])->name('checklist-items.mark-bought');
        Route::patch('checklist-items/{item}/mark-not-bought', [ChecklistItemController::class, 'markNotBought'])->name('checklist-items.mark-not-bought');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
