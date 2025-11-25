<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\business\Product;
use App\Models\business\Place;
use App\Models\business\Category;
use App\Models\business\Unit;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener IDs de lugares
        $zapatoca = Place::where('short_name', 'Zapatoca')->first();
        $alkosto = Place::where('short_name', 'Alkosto')->first();
        $d1 = Place::where('short_name', 'D1')->first();
        $dollarcity = Place::where('short_name', 'Dollarcity')->first();
        $donCamilo = Place::where('short_name', 'DonCamilo')->first();

        // Obtener IDs de categorías comunes
        $aceites = Category::where('name', 'Aceites')->first();
        $arroz = Category::where('name', 'Arroz')->first();
        $legumbres = Category::where('name', 'Legumbres')->first();
        $pasta = Category::where('name', 'Pasta')->first();
        $azucar = Category::where('name', 'Azúcar')->first();
        $salsas = Category::where('name', 'Salsas')->first();
        $cafe = Category::where('name', 'Café')->first();
        $cereales = Category::where('name', 'Cereales')->first();
        $chocolate = Category::where('name', 'Chocolate')->first();
        $carnes = Category::where('name', 'Carnes')->first();
        $pollo = Category::where('name', 'Pollo')->first();
        $galletas = Category::where('name', 'Galletas')->first();
        $dulces = Category::where('name', 'Dulces')->first();
        $limpieza = Category::where('name', 'Limpieza hogar')->first();
        $detergentes = Category::where('name', 'Detergentes')->first();
        $papelHigienico = Category::where('name', 'Papel higiénico')->first();
        $lacteos = Category::where('name', 'Lácteos')->first();
        $panaderia = Category::where('name', 'Panadería')->first();
        $aseoPersonal = Category::where('name', 'Aseo personal')->first();
        $pescado = Category::where('name', 'Pescado')->first();
        $snacks = Category::where('name', 'Snacks')->first();
        $huevos = Category::where('name', 'Huevos')->first();
        $medicamentos = Category::where('name', 'Medicamentos')->first();
        $frutas = Category::where('name', 'Frutas')->first();
        $verduras = Category::where('name', 'Verduras')->first();

        // Obtener unidad por defecto
        $unidad = Unit::where('short_name', 'Und')->first();
        $kg = Unit::where('short_name', 'Kg')->first();

        // Productos - TODOS CON STOCK = 0
        $products = [
            // Zapatoca - Despensa
            ['Aceite', $aceites->id, $zapatoca->id, $unidad->id, 20900, 0],
            ['Aceite oliva', $aceites->id, $zapatoca->id, $unidad->id, 60000, 0],
            ['Alcohol', $medicamentos->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Arroz', $arroz->id, $zapatoca->id, $unidad->id, 19750, 0],
            ['Arveja', $legumbres->id, $zapatoca->id, $unidad->id, 6000, 0],
            ['Atun', $pescado->id, $zapatoca->id, $unidad->id, 4450, 0],
            ['Avena', $cereales->id, $zapatoca->id, $unidad->id, 2000, 0],
            ['Azucar', $azucar->id, $zapatoca->id, $unidad->id, 10030, 0],
            ['Bechamel', $salsas->id, $zapatoca->id, $unidad->id, 4300, 0],
            ['Boloñesa', $salsas->id, $zapatoca->id, $unidad->id, 4300, 0],
            ['Bolsas Orión', $limpieza->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Bombillos', $limpieza->id, $zapatoca->id, $unidad->id, 4000, 0],
            ['Cabello de angel', $pasta->id, $zapatoca->id, $unidad->id, 2200, 0],
            ['Cafe', $cafe->id, $alkosto->id, $unidad->id, 20900, 0],
            ['Cebada', $cereales->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Cereal flops', $cereales->id, $zapatoca->id, $unidad->id, 5100, 0],
            ['Cereal 500g', $cereales->id, $zapatoca->id, $unidad->id, 11250, 0],
            ['Chocolate', $chocolate->id, $zapatoca->id, $unidad->id, 11950, 0],
            ['Chorizo', $carnes->id, $zapatoca->id, $unidad->id, 5600, 0],
            ['Color', $aseoPersonal->id, $zapatoca->id, $unidad->id, 2000, 0],
            ['Combo rica', $snacks->id, $zapatoca->id, $unidad->id, 11300, 0],
            ['Conchitas', $pasta->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Ducales', $galletas->id, $zapatoca->id, $unidad->id, 11900, 0],
            ['Dulces americandy', $dulces->id, $zapatoca->id, $unidad->id, 5800, 0],
            ['Estropajo', $limpieza->id, $zapatoca->id, $unidad->id, 4700, 0],
            ['Frijol bola roja', $legumbres->id, $zapatoca->id, $unidad->id, 10900, 0],
            ['Galletas saltinas', $galletas->id, $zapatoca->id, $unidad->id, 7200, 0],
            ['Garbanzo', $legumbres->id, $zapatoca->id, $unidad->id, 5900, 0],
            ['Gelatina', $dulces->id, $zapatoca->id, $unidad->id, 7300, 0],
            ['Gomas', $dulces->id, $zapatoca->id, $unidad->id, 2950, 0],
            ['Gomas orion', $dulces->id, $zapatoca->id, $unidad->id, 15000, 0],
            ['Guantes', $limpieza->id, $zapatoca->id, $unidad->id, 4300, 0],
            ['Harina arepas', $cereales->id, $zapatoca->id, $unidad->id, 3700, 0],
            ['Harina trigo', $cereales->id, $zapatoca->id, $unidad->id, 4300, 0],
            ['Huevos', $huevos->id, $zapatoca->id, $unidad->id, 15900, 0],
            ['Inhalador', $medicamentos->id, $zapatoca->id, $unidad->id, 15900, 0],
            ['Instacream', $lacteos->id, $zapatoca->id, $unidad->id, 19300, 0],
            ['Jabón Liquido manos', $limpieza->id, $zapatoca->id, $unidad->id, 17700, 0],
            ['Jabón loza', $detergentes->id, $zapatoca->id, $unidad->id, 8950, 0],
            ['Jabón rey', $limpieza->id, $zapatoca->id, $unidad->id, 8500, 0],
            ['Lasagna', $pasta->id, $zapatoca->id, $unidad->id, 9100, 0],
            ['Leche', $lacteos->id, $alkosto->id, $unidad->id, 37612, 0],
            ['Lentejas', $legumbres->id, $zapatoca->id, $unidad->id, 8000, 0],
            ['Limpion', $limpieza->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Maíz pira', $cereales->id, $zapatoca->id, $unidad->id, 3800, 0],
            ['Margarina', $lacteos->id, $zapatoca->id, $unidad->id, 4500, 0],
            ['Morcilla', $carnes->id, $zapatoca->id, $unidad->id, 9950, 0],
            ['Mortadela', $carnes->id, $zapatoca->id, $unidad->id, 9200, 0],
            ['Pan hamburguesa', $panaderia->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Pan perro', $panaderia->id, $zapatoca->id, $unidad->id, 3950, 0],
            ['Pan Sándwich', $panaderia->id, $zapatoca->id, $unidad->id, 5300, 0],
            ['Panela', $azucar->id, $zapatoca->id, $unidad->id, 3500, 0],
            ['Papel higiénico', $papelHigienico->id, $alkosto->id, $unidad->id, 14500, 0],
            ['Parmesano', $lacteos->id, $zapatoca->id, $unidad->id, 9400, 0],
            ['Rallador', $limpieza->id, $zapatoca->id, $unidad->id, 14500, 0],
            ['Ramen', $pasta->id, $alkosto->id, $unidad->id, 21900, 0],
            ['Sal', $azucar->id, $zapatoca->id, $unidad->id, 2600, 0],
            ['Salchichas', $carnes->id, $zapatoca->id, $unidad->id, 13700, 0],
            ['Salsa soya', $salsas->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Salsa teriyaki', $salsas->id, $zapatoca->id, $unidad->id, 0, 0],
            ['Saltinas mantequilla', $galletas->id, $zapatoca->id, $unidad->id, 7950, 0],
            ['Sándwich', $panaderia->id, $zapatoca->id, $unidad->id, 5000, 0],
            ['Sardinas', $pescado->id, $zapatoca->id, $unidad->id, 2900, 0],
            ['Shampoo', $aseoPersonal->id, $zapatoca->id, $unidad->id, 17950, 0],
            ['Spaguetti', $pasta->id, $zapatoca->id, $unidad->id, 5950, 0],
            ['Tallarines', $pasta->id, $zapatoca->id, $unidad->id, 2200, 0],
            ['Toalla cocina 660h', $limpieza->id, $zapatoca->id, $unidad->id, 17300, 0],
            ['Toallas higiénicas', $aseoPersonal->id, $zapatoca->id, $unidad->id, 12800, 0],
            ['Tostadas', $panaderia->id, $zapatoca->id, $unidad->id, 6100, 0],
            ['Yogurt', $lacteos->id, $zapatoca->id, $unidad->id, 5500, 0],

            // Zapatoca - Proteínas/Carnes
            ['Alas de pollo', $pollo->id, $zapatoca->id, $kg->id, 11800, 0],
            ['Atún lata', $pescado->id, $zapatoca->id, $unidad->id, 4500, 0],
            ['Bola de res', $carnes->id, $zapatoca->id, $kg->id, 31000, 0],
            ['Churrasco', $carnes->id, $zapatoca->id, $kg->id, 37980, 0],
            ['Costilla de cerdo', $carnes->id, $zapatoca->id, $kg->id, 23000, 0],
            ['Costilla de res', $carnes->id, $zapatoca->id, $kg->id, 18000, 0],
            ['Cuadros de res', $carnes->id, $zapatoca->id, $kg->id, 13400, 0],
            ['Carne molida', $carnes->id, $zapatoca->id, $kg->id, 24500, 0],
            ['Carne para asar', $carnes->id, $zapatoca->id, $kg->id, 27980, 0],
            ['Pechuga de pollo', $pollo->id, $zapatoca->id, $kg->id, 14900, 0],
            ['Pollo entero', $pollo->id, $zapatoca->id, $unidad->id, 24394, 0],
            ['Pierna pernil', $carnes->id, $zapatoca->id, $kg->id, 17612, 0],
            ['Pierna de cerdo', $carnes->id, $zapatoca->id, $kg->id, 17980, 0],
            ['Sardinas lata', $pescado->id, $zapatoca->id, $unidad->id, 3300, 0],
            ['Sobrebarriga', $carnes->id, $zapatoca->id, $kg->id, 25980, 0],
            ['Tocineta', $carnes->id, $zapatoca->id, $kg->id, 29000, 0],
            ['Lomo visceral', $carnes->id, $zapatoca->id, $kg->id, 20980, 0],
            ['Cadera de res', $carnes->id, $zapatoca->id, $kg->id, 35980, 0],
            ['Frijol cabeza negra', $legumbres->id, $zapatoca->id, $unidad->id, 7900, 0],
            ['Frijol caraota', $legumbres->id, $zapatoca->id, $unidad->id, 7900, 0],
            ['Papas bbq', $snacks->id, $zapatoca->id, $unidad->id, 8500, 0],

            // Alkosto
            ['Tortilla grande', $panaderia->id, $alkosto->id, $unidad->id, 12900, 0],

            // Dollarcity
            ['Agua oxigenada', $medicamentos->id, $dollarcity->id, $unidad->id, 11000, 0],

            // D1
            ['Ajo', $legumbres->id, $d1->id, $unidad->id, 1990, 0],
            ['Ambientador', $limpieza->id, $d1->id, $unidad->id, 5850, 0],
            ['Baterías AA', $limpieza->id, $d1->id, $unidad->id, 5000, 0],
            ['Biso lata', $pescado->id, $d1->id, $unidad->id, 2990, 0],
            ['Cabano', $carnes->id, $d1->id, $unidad->id, 3990, 0],
            ['Chocolate kit kat', $chocolate->id, $d1->id, $unidad->id, 3850, 0],
            ['Color D1', $aseoPersonal->id, $d1->id, $unidad->id, 950, 0],
            ['Copitos', $aseoPersonal->id, $d1->id, $unidad->id, 2450, 0],
            ['Crema de leche', $lacteos->id, $d1->id, $unidad->id, 2300, 0],
            ['Desodorante', $aseoPersonal->id, $d1->id, $unidad->id, 4490, 0],
            ['Doritos fake', $snacks->id, $d1->id, $unidad->id, 4990, 0],
            ['Frijol refrito', $legumbres->id, $d1->id, $unidad->id, 6950, 0],
            ['Galletas D1', $galletas->id, $d1->id, $unidad->id, 6000, 0],
            ['Galletas chocolate', $galletas->id, $d1->id, $unidad->id, 8500, 0],
            ['Galletas club', $galletas->id, $d1->id, $unidad->id, 3300, 0],
            ['Helado', $lacteos->id, $d1->id, $unidad->id, 2990, 0],
            ['Jabón líquido azul', $detergentes->id, $d1->id, $unidad->id, 12600, 0],
            ['Jabón polvo', $detergentes->id, $d1->id, $unidad->id, 9900, 0],
            ['Limpiatodo', $limpieza->id, $d1->id, $unidad->id, 5000, 0],
            ['Maíz dulce', $legumbres->id, $d1->id, $unidad->id, 5990, 0],
            ['Maní divertido', $snacks->id, $d1->id, $unidad->id, 4650, 0],
            ['Mascarilla', $aseoPersonal->id, $d1->id, $unidad->id, 3850, 0],
            ['Mayonesa', $salsas->id, $d1->id, $unidad->id, 3790, 0],
            ['Minibrownies', $dulces->id, $d1->id, $unidad->id, 6950, 0],
            ['Mostaza', $salsas->id, $d1->id, $unidad->id, 0, 0],
            ['Palitos chocolate', $dulces->id, $d1->id, $unidad->id, 2990, 0],
            ['Pan tajado', $panaderia->id, $d1->id, $unidad->id, 3290, 0],
            ['Papas fósforos', $snacks->id, $d1->id, $unidad->id, 3600, 0],
            ['Papas francesas', $snacks->id, $d1->id, $unidad->id, 4990, 0],
            ['Pasta de tomate', $salsas->id, $d1->id, $unidad->id, 2800, 0],
            ['Pastillas baño', $limpieza->id, $d1->id, $unidad->id, 3450, 0],
            ['Perlas fragancia', $limpieza->id, $d1->id, $unidad->id, 9900, 0],
            ['Pimienta', $azucar->id, $d1->id, $unidad->id, 1750, 0],
            ['Polvo abrasivo', $limpieza->id, $d1->id, $unidad->id, 2700, 0],
            ['Pon quesitos', $lacteos->id, $d1->id, $unidad->id, 5900, 0],
            ['Salsa tomate', $salsas->id, $d1->id, $unidad->id, 4490, 0],
            ['Suavitel', $limpieza->id, $d1->id, $unidad->id, 10000, 0],
            ['Tapabocas', $aseoPersonal->id, $d1->id, $unidad->id, 0, 0],
            ['Toallas Desinfectante', $limpieza->id, $d1->id, $unidad->id, 4750, 0],
            ['Toallas humedas', $aseoPersonal->id, $d1->id, $unidad->id, 3990, 0],
            ['Toallas húmedas mini', $aseoPersonal->id, $d1->id, $unidad->id, 1150, 0],
            ['Toallas mascotas', $limpieza->id, $d1->id, $unidad->id, 3850, 0],
            ['Vinagre', $salsas->id, $d1->id, $unidad->id, 2850, 0],
            ['Barra de chocolate', $chocolate->id, $d1->id, $unidad->id, 2990, 0],
            ['Bocadillo veleño', $dulces->id, $d1->id, $unidad->id, 4990, 0],
            ['Yogur griego', $lacteos->id, $d1->id, $unidad->id, 6950, 0],
            ['Mogolla', $panaderia->id, $d1->id, $unidad->id, 3400, 0],

            // Don Camilo - Frutas y Verduras
            ['Zanahoria', $verduras->id, $donCamilo->id, $kg->id, 3700, 0],
            ['Plátano', $frutas->id, $donCamilo->id, $kg->id, 2600, 0],
            ['Guatila', $verduras->id, $donCamilo->id, $kg->id, 1200, 0],
            ['Papa', $verduras->id, $donCamilo->id, $kg->id, 1100, 0],
            ['Cebolla cabezona blanca', $verduras->id, $donCamilo->id, $kg->id, 1900, 0],
            ['Tomate', $verduras->id, $donCamilo->id, $kg->id, 4000, 0],
            ['Espinaca', $verduras->id, $donCamilo->id, $kg->id, 4400, 0],
            ['Limón', $frutas->id, $donCamilo->id, $kg->id, 1800, 0],
            ['Raíces chinas', $verduras->id, $donCamilo->id, $kg->id, 1550, 0],
            ['Zuccini', $verduras->id, $donCamilo->id, $kg->id, 2000, 0],
            ['Mandarina', $frutas->id, $donCamilo->id, $kg->id, 2400, 0],
            ['Banano', $frutas->id, $donCamilo->id, $kg->id, 2700, 0],
            ['Arándanos', $frutas->id, $donCamilo->id, $kg->id, 5800, 0],
            ['Agraz', $frutas->id, $donCamilo->id, $kg->id, 4400, 0],
            ['Aguacate', $frutas->id, $donCamilo->id, $kg->id, 4500, 0],
            ['Mora', $frutas->id, $donCamilo->id, $kg->id, 4300, 0],
            ['Papa criolla', $verduras->id, $donCamilo->id, $kg->id, 2000, 0],
            ['Arveja verde', $legumbres->id, $donCamilo->id, $kg->id, 4800, 0],
            ['Lulo', $frutas->id, $donCamilo->id, $kg->id, 4300, 0],
            ['Pimentón', $verduras->id, $donCamilo->id, $kg->id, 2000, 0],
            ['Lechuga', $verduras->id, $donCamilo->id, $unidad->id, 1300, 0],
            ['Pepino ensalada', $verduras->id, $donCamilo->id, $kg->id, 1700, 0],
            ['Cebolla cabezona roja', $verduras->id, $donCamilo->id, $kg->id, 2000, 0],
            ['Cebolla larga', $verduras->id, $donCamilo->id, $kg->id, 2200, 0],
            ['Cilantro', $verduras->id, $donCamilo->id, $kg->id, 1300, 0],
            ['Brócoli', $verduras->id, $donCamilo->id, $kg->id, 5000, 0],
            ['Habichuela', $verduras->id, $donCamilo->id, $kg->id, 4800, 0],
            ['Pepino guiso', $verduras->id, $donCamilo->id, $kg->id, 3400, 0],
            ['Panela Don Camilo', $azucar->id, $donCamilo->id, $kg->id, 3600, 0],
            ['Huevos Don Camilo', $huevos->id, $donCamilo->id, $unidad->id, 13500, 0],
            ['Manzana', $frutas->id, $donCamilo->id, $kg->id, 6500, 0],
            ['Papaya', $frutas->id, $donCamilo->id, $kg->id, 1300, 0],
            ['Champiñón', $verduras->id, $donCamilo->id, $kg->id, 3900, 0],
            ['Miel', $azucar->id, $donCamilo->id, $kg->id, 6000, 0],
            ['Naranja', $frutas->id, $donCamilo->id, $kg->id, 3300, 0],
            ['Ajo Don Camilo', $verduras->id, $donCamilo->id, $kg->id, 12000, 0],
            ['Mazorca', $verduras->id, $donCamilo->id, $unidad->id, 2400, 0],
            ['Piña golden', $frutas->id, $donCamilo->id, $kg->id, 2000, 0],
            ['Puerro', $verduras->id, $donCamilo->id, $kg->id, 5000, 0],
            ['Guayaba', $frutas->id, $donCamilo->id, $kg->id, 2800, 0],
            ['Remolacha', $verduras->id, $donCamilo->id, $kg->id, 1400, 0],
            ['Yuca', $verduras->id, $donCamilo->id, $kg->id, 1300, 0],
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product[0],
                'category_id' => $product[1],
                'place_id' => $product[2],
                'unit_id' => $product[3],
                'price' => $product[4],
                'stock' => $product[5],
                'enabled' => true,
            ]);
        }
    }
}
