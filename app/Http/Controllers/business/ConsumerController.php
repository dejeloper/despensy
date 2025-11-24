<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\ConsumerRequest;
use App\Models\business\Consumer;
use Inertia\Inertia;

class ConsumerController extends Controller
{
    public function index()
    {
        $consumers = Consumer::paginate(10);
        return Inertia::render('consumers/index', [
            'consumers' => $consumers,
        ]);
    }

    public function create()
    {
        return Inertia::render('consumers/create');
    }

    public function store(ConsumerRequest $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
        ]);

        Consumer::create($request->all());

        return redirect()->route('consumers.index');
    }

    public function edit(Consumer $consumer)
    {
        return Inertia::render('consumers/edit', [
            'consumer' => $consumer,
        ]);
    }

    public function update(ConsumerRequest $request, Consumer $consumer)
    {
        $request->validate([
            'name' => 'string',
            'type' => 'string',
        ]);

        $consumer->update($request->all());

        return redirect()->route('consumers.index');
    }

    public function destroy(Consumer $consumer)
    {
        $consumer->delete();

        return redirect()->route('consumers.index');
    }
}
