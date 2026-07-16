<?php

namespace App\Services\business;

use App\Models\business\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProductLastPurchaseService
{
    /**
     * Get every product annotated with data from its most recent purchase
     * (price, place, unit, date), derived from checklist_items.was_bought = true.
     * Products never purchased come back with those columns as null.
     *
     * The join is pinned to a single checklist_item per product (the most
     * recent one) via a correlated subquery, so a product with more than one
     * purchase does not fan out into duplicate rows.
     *
     * When $activeChecklistId is given, also annotates each product with its
     * item on that specific checklist (if any) — used by the Despensa view
     * to know whether a product is already on the active shopping list.
     */
    public function allWithLastPurchase(?int $activeChecklistId = null): Collection
    {
        return Product::with('category')
            ->leftJoin('checklist_items as ci', function ($join) {
                $join->on('ci.id', '=', DB::raw('(
                    SELECT ci2.id
                    FROM checklist_items ci2
                    WHERE ci2.product_id = products.id AND ci2.was_bought = true
                    ORDER BY ci2.created_at DESC, ci2.id DESC
                    LIMIT 1
                )'));
            })
            ->leftJoin('places as last_place', 'last_place.id', '=', 'ci.place_id')
            ->leftJoin('units as last_unit', 'last_unit.id', '=', 'ci.unit_id_bought')
            ->select([
                'products.*',
                'ci.unit_price as last_price',
                'ci.created_at as last_purchase_date',
                'last_place.name as last_place_name',
                'last_place.bg_color as last_place_bg_color',
                'last_place.text_color as last_place_text_color',
                'last_unit.name as last_unit_name',
            ])
            ->when($activeChecklistId, function ($query, $activeChecklistId) {
                $query->leftJoin('checklist_items as active_ci', function ($join) use ($activeChecklistId) {
                    $join->on('active_ci.product_id', '=', 'products.id')
                        ->where('active_ci.checklist_id', '=', $activeChecklistId);
                })->addSelect([
                    'active_ci.id as active_checklist_item_id',
                    'active_ci.quantity_planned as active_quantity_planned',
                    'active_ci.unit_id_planned as active_unit_id_planned',
                    'active_ci.quantity_at_home as active_quantity_at_home',
                    'active_ci.unit_id_at_home as active_unit_id_at_home',
                ]);
            })
            ->orderByRaw('COALESCE(ci.created_at, products.created_at) DESC')
            ->get();
    }
}
