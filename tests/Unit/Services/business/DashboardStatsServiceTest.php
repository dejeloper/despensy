<?php

use App\Models\business\Category;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Services\business\DashboardStatsService;

describe('DashboardStatsService', function () {
    test('topCategoriesByPurchases ranks categories by bought items, via each item\'s product', function () {
        $checklist = Checklist::factory()->create();
        $favorite = Category::factory()->create();
        $occasional = Category::factory()->create();
        $untouched = Category::factory()->create();

        $favoriteProduct = Product::factory()->withRelationships($favorite->id)->create();
        $occasionalProduct = Product::factory()->withRelationships($occasional->id)->create();
        Product::factory()->withRelationships($untouched->id)->create();

        ChecklistItem::factory()->bought()->count(4)->create(['checklist_id' => $checklist->id, 'product_id' => $favoriteProduct->id]);
        ChecklistItem::factory()->bought()->count(1)->create(['checklist_id' => $checklist->id, 'product_id' => $occasionalProduct->id]);

        $top = (new DashboardStatsService)->topCategoriesByPurchases(3);

        expect($top)->toHaveCount(2)
            ->and($top->first()['category']->id)->toBe($favorite->id)
            ->and($top->first()['purchases_count'])->toBe(4)
            ->and($top->last()['purchases_count'])->toBe(1);
    });

    test('topCategoriesByPurchases respects the limit', function () {
        $checklist = Checklist::factory()->create();

        foreach (Category::factory()->count(4)->create() as $category) {
            $product = Product::factory()->withRelationships($category->id)->create();
            ChecklistItem::factory()->bought()->create(['checklist_id' => $checklist->id, 'product_id' => $product->id]);
        }

        expect((new DashboardStatsService)->topCategoriesByPurchases(3))->toHaveCount(3);
    });

    test('topPlacesByPurchases ranks places by bought items, ignoring unbought ones', function () {
        $checklist = Checklist::factory()->create();
        $favorite = Place::factory()->create();
        $occasional = Place::factory()->create();

        ChecklistItem::factory()->bought()->count(3)->create(['checklist_id' => $checklist->id, 'place_id' => $favorite->id]);
        ChecklistItem::factory()->bought()->count(1)->create(['checklist_id' => $checklist->id, 'place_id' => $occasional->id]);
        ChecklistItem::factory()->create(['checklist_id' => $checklist->id, 'place_id' => null]);

        $top = (new DashboardStatsService)->topPlacesByPurchases(3);

        expect($top)->toHaveCount(2)
            ->and($top->first()['place']->id)->toBe($favorite->id)
            ->and($top->first()['purchases_count'])->toBe(3)
            ->and($top->last()['purchases_count'])->toBe(1);
    });

    test('topPlacesByPurchases respects the limit', function () {
        $checklist = Checklist::factory()->create();

        foreach (Place::factory()->count(4)->create() as $place) {
            ChecklistItem::factory()->bought()->create(['checklist_id' => $checklist->id, 'place_id' => $place->id]);
        }

        expect((new DashboardStatsService)->topPlacesByPurchases(3))->toHaveCount(3);
    });

    test('topProductsByPurchases ranks products by times bought', function () {
        $checklist = Checklist::factory()->create();
        $bestseller = Product::factory()->create();
        $niche = Product::factory()->create();

        ChecklistItem::factory()->bought()->count(5)->create(['checklist_id' => $checklist->id, 'product_id' => $bestseller->id]);
        ChecklistItem::factory()->bought()->count(1)->create(['checklist_id' => $checklist->id, 'product_id' => $niche->id]);

        $top = (new DashboardStatsService)->topProductsByPurchases(5);

        expect($top->first()['product']->id)->toBe($bestseller->id)
            ->and($top->first()['purchases_count'])->toBe(5);
    });
});
