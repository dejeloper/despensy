<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductContainerResource;
use App\Http\Resources\UnitEquivalenceResource;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\ProductContainer;
use App\Models\business\Unit;
use App\Models\business\UnitEquivalence;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquivalenceController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('equivalences/index', [
            'unitEquivalences' => UnitEquivalence::with(['unit', 'parent'])
                ->get()
                ->map(fn($equivalence) => (new UnitEquivalenceResource($equivalence))->resolve($request)),
            'productContainers' => ProductContainer::with(['product', 'place', 'containerUnit', 'contentUnit'])
                ->get()
                ->map(fn($container) => (new ProductContainerResource($container))->resolve($request)),
            'units' => Unit::enabled()->orderBy('name')->get(['id', 'name', 'short_name']),
            'products' => Product::where('enabled', true)->orderBy('name')->get(['id', 'name']),
            'places' => Place::where('enabled', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
