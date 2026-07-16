<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\DespensaProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\business\Category;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Services\business\ChecklistItemService;
use App\Services\business\ChecklistLifecycleService;
use App\Services\business\ProductLastPurchaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DespensyController extends Controller
{
    public function __construct(
        private ChecklistLifecycleService $lifecycleService,
        private ChecklistItemService $itemService,
        private ProductLastPurchaseService $lastPurchaseService,
    ) {}

    public function index(Request $request)
    {
        $checklist = $this->lifecycleService->activeChecklistFor($request->user());

        $products = $this->lastPurchaseService->allWithLastPurchase($checklist->id)
            ->map(fn ($product) => (new ProductResource($product))->resolve($request));

        return Inertia::render('despensy/index', [
            'products' => $products,
            'categories' => Category::where('enabled', true)->get(['id', 'name']),
            'units' => Unit::where('enabled', true)->get(['id', 'name', 'short_name']),
            'checklist' => [
                'id' => $checklist->id,
                'name' => $checklist->name,
                'updated_at' => $checklist->updated_at?->format('Y-m-d H:i:s'),
            ],
            'checklistIsStale' => $this->lifecycleService->isStale($checklist),
        ]);
    }

    public function updateProductState(DespensaProductRequest $request, Product $product)
    {
        $checklist = $this->lifecycleService->activeChecklistFor($request->user());

        $this->itemService->syncProduct($checklist, $product, $request->validated());

        return back()->with('success', 'Producto actualizado en la despensa.');
    }

    public function renewChecklist(Request $request)
    {
        $this->lifecycleService->openNewFor($request->user());

        return back()->with('success', 'Nueva lista de compra creada.');
    }
}
