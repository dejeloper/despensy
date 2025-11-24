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
    public function index()
    {
        $products = Product::with(['category', 'place', 'unit'])->paginate(10);
        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = Category::where('enabled', true)->get();
        $places = Place::where('enabled', true)->get();
        $units = Unit::where('enabled', true)->get();

        return Inertia::render('products/create', [
            'categories' => $categories,
            'places' => $places,
            'units' => $units,
        ]);
    }

    public function store(ProductRequest $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'place_id' => 'required|exists:places,id',
            'unit_id' => 'required|exists:units,id',
            'price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'enabled' => 'boolean',
        ]);

        Product::create($request->all());

        return redirect()->route('products.index');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('enabled', true)->get();
        $places = Place::where('enabled', true)->get();
        $units = Unit::where('enabled', true)->get();

        return Inertia::render('products/edit', [
            'product' => $product->load(['category', 'place', 'unit']),
            'categories' => $categories,
            'places' => $places,
            'units' => $units,
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $request->validate([
            'name' => 'string',
            'description' => 'nullable|string',
            'category_id' => 'exists:categories,id',
            'place_id' => 'exists:places,id',
            'unit_id' => 'exists:units,id',
            'price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'enabled' => 'boolean',
        ]);

        $product->update($request->all());

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index');
    }

    public function updatePrice(ProductRequest $request, Product $product)
    {
        $request->validate([
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
        ]);

        $product->update($request->only(['price', 'stock']));

        return $product;
    }
}
