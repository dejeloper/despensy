<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChecklistItemResource;
use App\Models\business\Place;
use App\Models\business\Unit;
use App\Services\business\ChecklistLifecycleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function __construct(
        private ChecklistLifecycleService $lifecycleService,
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
            'places' => Place::where('enabled', true)->get(['id', 'name']),
            'units' => Unit::where('enabled', true)->get(['id', 'name', 'short_name']),
        ]);
    }
}
