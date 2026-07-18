<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\ChecklistRequest;
use App\Http\Resources\ChecklistResource;
use App\Models\business\Checklist;
use App\Services\business\ChecklistLifecycleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChecklistController extends Controller
{
    public function __construct(private ChecklistLifecycleService $lifecycleService) {}

    public function index(Request $request)
    {
        $checklists = Checklist::with(['state', 'user'])
            ->withCount('items')
            ->forUser($request->user()->id)
            ->latest('updated_at')
            ->get();

        return Inertia::render('checklists/index', [
            'checklists' => [
                'data' => $checklists->map(fn ($checklist) => (new ChecklistResource($checklist))->resolve($request))->all(),
                'links' => [],
                'current_page' => 1,
                'per_page' => $checklists->count(),
                'total' => $checklists->count(),
            ],
        ]);
    }

    public function show(Request $request, Checklist $checklist)
    {
        abort_unless($checklist->user_id === $request->user()->id, 403);

        $checklist->load(['state', 'items.product', 'items.unitPlanned', 'items.unitBought', 'items.place']);

        return Inertia::render('checklists/show', [
            'checklist' => (new ChecklistResource($checklist))->resolve($request),
        ]);
    }

    public function store(ChecklistRequest $request)
    {
        $this->lifecycleService->openNewFor($request->user(), $request->validated('name'));

        return redirect()
            ->route('despensy.index')
            ->with('success', 'Lista de compra creada exitosamente.');
    }

    public function complete(Request $request, Checklist $checklist)
    {
        abort_unless($checklist->user_id === $request->user()->id, 403);

        $this->lifecycleService->complete($checklist);

        return redirect()
            ->route('checklists.index')
            ->with('success', 'Lista completada exitosamente.');
    }

    public function cancel(Request $request, Checklist $checklist)
    {
        abort_unless($checklist->user_id === $request->user()->id, 403);

        $this->lifecycleService->cancel($checklist);

        return redirect()
            ->route('checklists.index')
            ->with('success', 'Lista cancelada.');
    }
}
