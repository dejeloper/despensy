<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            StateSeeder::class,
            CategorySeeder::class,
            PlaceSeeder::class,
            UnitSeeder::class,
            ProductSeeder::class,
            ChecklistSeeder::class,
        ]);
    }
}
