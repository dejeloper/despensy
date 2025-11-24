<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Models\business\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::with(['product', 'unit', 'place', 'consumer'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'unit_id' => 'required|exists:units,id',
            'place_id' => 'required|exists:places,id',
            'consumer_id' => 'required|exists:consumers,id',
            'total_price' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $validator = new \App\Services\PurchaseValidationService();
        $errors = $validator->validate($request->all());

        if (!empty($errors)) {
            return response()->json(['errors' => $errors], 422);
        }

        return Expense::create($request->all());
    }
}
