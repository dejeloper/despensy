<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = [
            ['Frutas', '🍎', '#ffadad', '#000000'],
            ['Verduras', '🥦', '#b5e48c', '#000000'],
            ['Carnes', '🥩', '#ff6b6b', '#ffffff'],
            ['Pollo', '🍗', '#f4a261', '#000000'],
            ['Pescado', '🐟', '#90e0ef', '#000000'],
            ['Mariscos', '🦐', '#ffb5a7', '#000000'],
            ['Panadería', '🥖', '#ffe5b4', '#000000'],
            ['Lácteos', '🥛', '#e0fbfc', '#000000'],
            ['Quesos', '🧀', '#fff1a8', '#000000'],
            ['Huevos', '🥚', '#faf3dd', '#000000'],
            ['Cereales', '🥣', '#ffe066', '#000000'],
            ['Legumbres', '🫘', '#d9ed92', '#000000'],
            ['Aceites', '🫒', '#b5c99a', '#000000'],
            ['Pasta', '🍝', '#ffd97d', '#000000'],
            ['Arroz', '🍚', '#f8edeb', '#000000'],
            ['Azúcar', '🍬', '#f9c6d4', '#000000'],
            ['Sal', '🧂', '#f1f1f1', '#000000'],
            ['Especias', '🌶️', '#ffb4a2', '#000000'],
            ['Salsas', '🥫', '#f6bd60', '#000000'],
            ['Galletas', '🍪', '#d4a373', '#ffffff'],
            ['Dulces', '🍭', '#f7b7a3', '#000000'],
            ['Chocolate', '🍫', '#6f4e37', '#ffffff'],
            ['Snacks', '🍿', '#ffe66d', '#000000'],
            ['Refrescos', '🥤', '#ff4d6d', '#ffffff'],
            ['Jugos', '🧃', '#f8c291', '#000000'],
            ['Café', '☕', '#9d6b53', '#ffffff'],
            ['Té', '🍵', '#b7e4c7', '#000000'],
            ['Agua', '💧', '#caf0f8', '#000000'],
            ['Cerveza', '🍺', '#ffd166', '#000000'],
            ['Vinos', '🍷', '#9b2226', '#ffffff'],
            ['Licores', '🥃', '#bb9457', '#ffffff'],
            ['Congelados', '❄️', '#ade8f4', '#000000'],
            ['Helados', '🍦', '#fcd5ce', '#000000'],
            ['Limpieza hogar', '🧽', '#caffbf', '#000000'],
            ['Detergentes', '🧴', '#bde0fe', '#000000'],
            ['Suavizantes', '🫧', '#e0aaff', '#000000'],
            ['Papel higiénico', '🧻', '#f8edeb', '#000000'],
            ['Toallas', '🧼', '#ffe5ec', '#000000'],
            ['Aseo personal', '🪥', '#cdb4db', '#000000'],
            ['Shampoo', '🧴', '#b5ead7', '#000000'],
            ['Jabones', '🫧', '#a0c4ff', '#000000'],
            ['Cuidado bebé', '🍼', '#f1c0e8', '#000000'],
            ['Mascotas', '🐶', '#ffcf56', '#000000'],
            ['Alimento mascotas', '🥫', '#fec89a', '#000000'],
            ['Productos de higiene', '🧴', '#caffbf', '#000000'],
            ['Medicamentos', '💊', '#f8d7da', '#000000'],
            ['Vitaminas', '🧃', '#fcd5ce', '#000000'],
            ['Electrónicos pequeños', '🔌', '#dee2ff', '#000000'],
            ['Baterías', '🔋', '#d0f4de', '#000000'],
        ];

        $data = array_map(fn ($c) => [
            'name' => $c[0],
            'icon' => $c[1],
            'bg_color' => $c[2],
            'text_color' => $c[3],
        ], $categories);

        DB::table('categories')->insert($data);
    }
}
