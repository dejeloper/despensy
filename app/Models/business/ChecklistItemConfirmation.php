<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class ChecklistItemConfirmation extends Model
{
    use HasFactory;

    protected $table = 'checklist_item_confirmations';

    protected $fillable = [
        'checklist_item_id',
        'se_compro',
        'place_final_id',
        'unit_final_id',
        'cantidad_comprada',
        'precio_unitario',
        'precio_total',
        'usuario_id',
    ];

    public function checklistItem()
    {
        return $this->belongsTo(ChecklistDetail::class, 'checklist_item_id');
    }

    protected static function booted()
    {
        static::saving(function (ChecklistItemConfirmation $model) {
            $cantidad = (float) ($model->cantidad_comprada ?? 0);
            $precioUnitario = (float) ($model->precio_unitario ?? 0);
            $model->precio_total = $precioUnitario * $cantidad;

            if (!empty($model->se_compro)) {
                if (Schema::hasColumn($model->getTable(), 'fecha_compra')) {
                    $model->fecha_compra = Carbon::now();
                }
            }
        });
    }

    public function place()
    {
        return $this->belongsTo(Place::class, 'place_final_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_final_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
