<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Services\business\ChecklistLifecycleService;
use App\Services\business\DashboardStatsService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private ChecklistLifecycleService $lifecycleService,
        private DashboardStatsService $statsService,
    ) {}

    public function index()
    {
        $checklist = $this->lifecycleService->openChecklistFor();
        $checklist?->load('state');

        return Inertia::render('dashboard', [
            'activeChecklist' => $checklist ? [
                'id' => $checklist->id,
                'name' => $checklist->name,
                'state' => [
                    'name' => $checklist->state->name,
                    'color' => $checklist->state->color,
                ],
                'itemsCount' => $checklist->items()->count(),
            ] : null,
            'topCategories' => $this->statsService->topCategoriesByPurchases(3)->map(fn ($row) => [
                'category' => [
                    'id' => $row['category']->id,
                    'name' => $row['category']->name,
                    'icon' => $row['category']->icon,
                    'bg_color' => $row['category']->bg_color,
                    'text_color' => $row['category']->text_color,
                ],
                'purchases_count' => $row['purchases_count'],
            ])->values(),
            'topPlaces' => $this->statsService->topPlacesByPurchases(3)->map(fn ($row) => [
                'place' => [
                    'id' => $row['place']->id,
                    'name' => $row['place']->name,
                    'bg_color' => $row['place']->bg_color,
                    'text_color' => $row['place']->text_color,
                ],
                'purchases_count' => $row['purchases_count'],
            ])->values(),
            'topProducts' => $this->statsService->topProductsByPurchases(5)->map(fn ($row) => [
                'product' => [
                    'id' => $row['product']->id,
                    'name' => $row['product']->name,
                ],
                'purchases_count' => $row['purchases_count'],
            ])->values(),
        ]);
    }
}
