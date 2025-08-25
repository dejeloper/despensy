<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'bg_color',
        'text_color',
        'enabled'
    ];
}
