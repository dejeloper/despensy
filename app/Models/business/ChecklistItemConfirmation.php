<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

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
        'fecha_compra',
        'usuario_id',
    ];

    public function checklistItem()
    {
        return $this->belongsTo(ChecklistDetail::class, 'checklist_item_id');
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
?>
