<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\ProductRequest;
use App\Models\business\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::query()->orderBy('name')
            ->paginate()
            ->withQueryString();

        return  Inertia::render('products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $validated = $request->validated();

        $product = new Product();
        $product->name = $validated['name'];
        $product->slug = $validated['slug'];
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return Inertia::render('products/show', ['product' => $product]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::findOrFail($id);
        return Inertia::render('products/Edit', ['product' => $product]);
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
