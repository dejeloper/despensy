<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\business\Consumer;

class ConsumerSeeder extends Seeder
{
    public function run()
    {
        Consumer::create(['name' => 'Familia', 'type' => 'human']);
        Consumer::create(['name' => 'Anny', 'type' => 'human']);
        Consumer::create(['name' => 'Jhonatan', 'type' => 'human']);
        Consumer::create(['name' => 'Mascota', 'type' => 'pet']);
        Consumer::create(['name' => 'Visita', 'type' => 'human']);
    }
}
