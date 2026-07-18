<?php

namespace App\Http\Controllers\business;

use App\Exceptions\ChecklistNotEditableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\business\CheckoutAddProductRequest;
use App\Http\Resources\ChecklistItemResource;
use App\Models\business\Category;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Services\business\ChecklistItemService;
use App\Services\business\ChecklistLifecycleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function __construct(
        private ChecklistLifecycleService $lifecycleService,
        private ChecklistItemService $itemService,
    ) {}

    public function index(Request $request)
    {
        $checklist = $this->lifecycleService->activeChecklistFor($request->user());

        $pendingItems = $checklist->items()
            ->where('was_bought', false)
            ->whereNotNull('quantity_planned')
            ->with(['product.category', 'unitPlanned'])
            ->get()
            ->map(fn ($item) => (new ChecklistItemResource($item))->resolve($request));

        $boughtItems = $checklist->items()
            ->where('was_bought', true)
            ->with(['product.category', 'unitBought', 'place'])
            ->latest('updated_at')
            ->get()
            ->map(fn ($item) => (new ChecklistItemResource($item))->resolve($request));

        return Inertia::render('checkout/index', [
            'checklist' => ['id' => $checklist->id, 'name' => $checklist->name],
            'items' => $pendingItems,
            'boughtItems' => $boughtItems,
            'places' => Place::where('enabled', true)->get(['id', 'name', 'bg_color', 'text_color']),
            'units' => Unit::where('enabled', true)->get(['id', 'name', 'short_name']),
            'products' => Product::where('enabled', true)->get(['id', 'name']),
            'categories' => Category::where('enabled', true)->get(['id', 'name']),
        ]);
    }

    public function addProduct(CheckoutAddProductRequest $request)
    {
        $checklist = $this->lifecycleService->activeChecklistFor($request->user());
        $product = Product::findOrFail($request->validated('product_id'));

        try {
            $this->itemService->addPurchasedProduct($checklist, $product, $request->validated());
        } catch (ChecklistNotEditableException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Producto agregado como comprado.');
    }
}
