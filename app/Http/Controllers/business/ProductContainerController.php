<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\ProductContainerRequest;
use App\Models\business\ProductContainer;

class ProductContainerController extends Controller
{
    public function store(ProductContainerRequest $request)
    {
        ProductContainer::create($request->validated());

        return back()->with('success', 'Contenedor creado exitosamente.');
    }

    public function update(ProductContainerRequest $request, ProductContainer $productContainer)
    {
        $productContainer->update($request->validated());

        return back()->with('success', 'Contenedor actualizado exitosamente.');
    }

    public function destroy(ProductContainer $productContainer)
    {
        $productContainer->delete();

        return back()->with('success', 'Contenedor eliminado exitosamente.');
    }
}
