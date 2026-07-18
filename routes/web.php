<?php

use App\Http\Controllers\business\CategoryController;
use App\Http\Controllers\business\ChecklistController;
use App\Http\Controllers\business\ChecklistItemController;
use App\Http\Controllers\business\CheckoutController;
use App\Http\Controllers\business\DespensyController;
use App\Http\Controllers\business\PlaceController;
use App\Http\Controllers\business\ProductController;
use App\Http\Controllers\business\UnitController;
use App\Services\business\ChecklistLifecycleService;
use App\Services\business\DashboardStatsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('despensy.index');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request, ChecklistLifecycleService $lifecycleService, DashboardStatsService $statsService) {
        $checklist = $lifecycleService->openChecklistFor($request->user());
        $checklist?->load('state');

        return Inertia::render('dashboard', [
            'activeChecklist' => $checklist ? [
                'id' => $checklist->id,
                'name' => $checklist->name,
                'state' => [
                    'name' => $checklist->state->name,
                    'color' => $checklist->state->color,
                ],
                'itemsCount' => $checklist->items()->count(),
            ] : null,
            'topCategories' => $statsService->topCategoriesByPurchases(3)->map(fn ($row) => [
                'category' => [
                    'id' => $row['category']->id,
                    'name' => $row['category']->name,
                    'icon' => $row['category']->icon,
                    'bg_color' => $row['category']->bg_color,
                    'text_color' => $row['category']->text_color,
                ],
                'purchases_count' => $row['purchases_count'],
            ])->values(),
            'topPlaces' => $statsService->topPlacesByPurchases(3)->map(fn ($row) => [
                'place' => [
                    'id' => $row['place']->id,
                    'name' => $row['place']->name,
                    'bg_color' => $row['place']->bg_color,
                    'text_color' => $row['place']->text_color,
                ],
                'purchases_count' => $row['purchases_count'],
            ])->values(),
            'topProducts' => $statsService->topProductsByPurchases(5)->map(fn ($row) => [
                'product' => [
                    'id' => $row['product']->id,
                    'name' => $row['product']->name,
                ],
                'purchases_count' => $row['purchases_count'],
            ])->values(),
        ]);
    })->name('dashboard');

    Route::get('despensy', [DespensyController::class, 'index'])->name('despensy.index');
    Route::put('despensy/products/{product}', [DespensyController::class, 'updateProductState'])->name('despensy.products.update');
    Route::post('despensy/checklist/renew', [DespensyController::class, 'renewChecklist'])->name('despensy.checklist.renew');

    Route::get('despensy/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('despensy/checkout/products', [CheckoutController::class, 'addProduct'])->name('checkout.add-product');

    Route::prefix('dashboard')->group(function () {
        Route::resource('categories', CategoryController::class)->except(['show']);

        Route::resource('places', PlaceController::class)->except(['show']);

        Route::resource('units', UnitController::class)->except(['show']);

        Route::resource('products', ProductController::class);

        Route::get('checklists', [ChecklistController::class, 'index'])->name('checklists.index');
        Route::post('checklists', [ChecklistController::class, 'store'])->name('checklists.store');
        Route::get('checklists/{checklist}', [ChecklistController::class, 'show'])->name('checklists.show');
        Route::post('checklists/{checklist}/complete', [ChecklistController::class, 'complete'])->name('checklists.complete');
        Route::post('checklists/{checklist}/cancel', [ChecklistController::class, 'cancel'])->name('checklists.cancel');

        Route::patch('checklist-items/{item}/mark-bought', [ChecklistItemController::class, 'markBought'])->name('checklist-items.mark-bought');
        Route::patch('checklist-items/{item}/mark-not-bought', [ChecklistItemController::class, 'markNotBought'])->name('checklist-items.mark-not-bought');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
