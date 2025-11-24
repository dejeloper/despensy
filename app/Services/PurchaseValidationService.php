<?php

namespace App\Services;

use App\Models\business\Product;
use App\Models\business\Place;

class PurchaseValidationService
{
    private const MAX_QUANTITY_PER_PURCHASE = 10;

    public function validate(array $data): array
    {
        $errors = [];

        $product = Product::with(['category', 'place'])->findOrFail($data['product_id']);
        $place = Place::findOrFail($data['place_id']);

        $errors = array_merge($errors, $this->validateProductEnabled($product));
        $errors = array_merge($errors, $this->validateQuantity($data['quantity']));
        $errors = array_merge($errors, $this->validatePlace($product, $place));

        return $errors;
    }

    private function validateProductEnabled(Product $product): array
    {
        if (!$product->enabled) {
            return ["El producto '{$product->name}' no está disponible para compra."];
        }
        return [];
    }

    private function validateQuantity(int $quantity): array
    {
        if ($quantity <= 0) {
            return ["La cantidad debe ser mayor a 0."];
        }

        if ($quantity > self::MAX_QUANTITY_PER_PURCHASE) {
            return ["La cantidad {$quantity} excede el límite de " . self::MAX_QUANTITY_PER_PURCHASE . " unidades por compra."];
        }

        return [];
    }

    private function validatePlace(Product $product, Place $place): array
    {
        if ($product->place_id !== $place->id) {
            return [
                "El producto '{$product->name}' debe comprarse en '{$product->place->name}', no en '{$place->name}'."
            ];
        }

        return [];
    }
}
