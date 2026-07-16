<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\business\Product;
use App\Models\business\Category;
use App\Models\business\Place;
use App\Models\business\Unit;
use App\Services\business\ProductLastPurchaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(private ProductLastPurchaseService $lastPurchaseService)
    {
    }

    public function index(Request $request)
    {
        // Obtener todos los productos para búsqueda/paginación en el cliente
        $allProducts = $this->lastPurchaseService->allWithLastPurchase();

        // Crear estructura compatible con paginación
        $products = [
            'data' => ProductResource::collection($allProducts),
            'links' => [], // Se generarán en el cliente
            'current_page' => 1,
            'per_page' => $allProducts->count(),
            'total' => $allProducts->count(),
        ];

        // Obtener datos para los filtros
        $categories = Category::where('enabled', true)->get(['id', 'name']);
        $places = Place::where('enabled', true)->get(['id', 'name']);
        $units = Unit::where('enabled', true)->get(['id', 'name', 'short_name']);

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'places' => $places,
            'units' => $units,
        ]);
    }

    public function create()
    {
        $categories = Category::where('enabled', true)->get(['id', 'name', 'icon', 'bg_color', 'text_color']);

        return Inertia::render('products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(ProductRequest $request)
    {
        Product::create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('enabled', true)->get(['id', 'name', 'icon', 'bg_color', 'text_color']);

        return Inertia::render('products/edit', [
            'product' => new ProductResource($product->load('category')),
            'categories' => $categories,
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();

            return redirect()
                ->route('products.index')
                ->with('success', 'Producto eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()
                ->route('products.index')
                ->with('error', 'No se pudo eliminar el producto. Puede estar en uso.');
        }
    }
}
