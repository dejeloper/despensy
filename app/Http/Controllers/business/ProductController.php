<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\ProductRequest;
use App\Models\business\Product;
use App\Models\business\Category;
use App\Models\business\Place;
use App\Models\business\Unit;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::query()->orderBy('name')->with('category', 'place', 'unit')
            ->paginate()
            ->withQueryString();

        return  Inertia::render('products/index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('enabled', true)->orderBy('name')->get();
        $places = Place::where('enabled', true)->orderBy('name')->get();
        $units = Unit::where('enabled', true)->orderBy('name')->get();

        return Inertia::render('products/create', [
            'categories' => $categories,
            'places' => $places,
            'units' => $units
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $validated = $request->validated();

        $product = new Product();
        $product->name = $validated['name'];
        $product->description = $validated['description'];
        $product->image = $validated['image'];
        $product->category_id = $validated['category_id'];
        $product->place_id = $validated['place_id'];
        $product->unit_id = $validated['unit_id'];
        $product->enabled = true;
        $product->save();

        return redirect()->route('products.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with('category', 'place', 'unit')->findOrFail($id);
        $categories = Category::where('enabled', true)->orderBy('name')->get();
        $places = Place::where('enabled', true)->orderBy('name')->get();
        $units = Unit::where('enabled', true)->orderBy('name')->get();

        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
            'places' => $places,
            'units' => $units
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validated();

        $product->update($validated);

        return redirect()->route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('products.index');
    }
}
