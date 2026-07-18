<?php

namespace App\Services\business;

use App\Models\business\Category;
use App\Models\business\ChecklistItem;
use App\Models\business\Product;
use Illuminate\Support\Collection;

/**
 * Aggregated numbers shown on the dashboard: purchase rankings derived
 * from bought ChecklistItems (see docs/DOMAIN.md).
 */
class DashboardStatsService
{
    /**
     * Categories ranked by number of bought items, descending (via each
     * item's product). A category with no purchases yet never appears.
     *
     * @return Collection<int, array{category: Category, purchases_count: int}>
     */
    public function topCategoriesByPurchases(int $limit = 3): Collection
    {
        return ChecklistItem::bought()
            ->join('products', 'products.id', '=', 'checklist_items.product_id')
            ->selectRaw('products.category_id, count(*) as purchases_count')
            ->groupBy('products.category_id')
            ->orderByDesc('purchases_count')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'category' => Category::find($row->category_id),
                'purchases_count' => $row->purchases_count,
            ]);
    }

    /**
     * Places ranked by number of bought items, descending.
     *
     * @return Collection<int, array{place: Place, purchases_count: int}>
     */
    public function topPlacesByPurchases(int $limit = 3): Collection
    {
        return ChecklistItem::bought()
            ->whereNotNull('place_id')
            ->selectRaw('place_id, count(*) as purchases_count')
            ->groupBy('place_id')
            ->orderByDesc('purchases_count')
            ->limit($limit)
            ->with('place')
            ->get()
            ->map(fn ($row) => [
                'place' => $row->place,
                'purchases_count' => $row->purchases_count,
            ]);
    }

    /**
     * Products ranked by number of times bought, descending.
     *
     * @return Collection<int, array{product: Product, purchases_count: int}>
     */
    public function topProductsByPurchases(int $limit = 5): Collection
    {
        return ChecklistItem::bought()
            ->selectRaw('product_id, count(*) as purchases_count')
            ->groupBy('product_id')
            ->orderByDesc('purchases_count')
            ->limit($limit)
            ->with('product')
            ->get()
            ->map(fn ($row) => [
                'product' => $row->product,
                'purchases_count' => $row->purchases_count,
            ]);
    }
}
