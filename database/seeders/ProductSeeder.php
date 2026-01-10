<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\business\Product;
use App\Models\business\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {

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

        // Productos - TODOS CON STOCK = 0
        $products = [
            // Zapatoca - Despensa
            ['Aceite', $aceites->id],
            ['Aceite oliva', $aceites->id],
            ['Alcohol', $medicamentos->id],
            ['Arroz', $arroz->id],
            ['Arveja', $legumbres->id],
            ['Atun', $pescado->id],
            ['Avena', $cereales->id],
            ['Azucar', $azucar->id],
            ['Bechamel', $salsas->id],
            ['Boloñesa', $salsas->id],
            ['Bolsas Orión', $limpieza->id],
            ['Bombillos', $limpieza->id],
            ['Cabello de angel', $pasta->id],
            ['Cafe', $cafe->id],
            ['Cebada', $cereales->id],
            ['Cereal flops', $cereales->id],
            ['Cereal 500g', $cereales->id],
            ['Chocolate', $chocolate->id],
            ['Chorizo', $carnes->id],
            ['Color', $aseoPersonal->id],
            ['Combo rica', $snacks->id],
            ['Conchitas', $pasta->id],
            ['Ducales', $galletas->id],
            ['Dulces americandy', $dulces->id],
            ['Estropajo', $limpieza->id],
            ['Frijol bola roja', $legumbres->id],
            ['Galletas saltinas', $galletas->id],
            ['Garbanzo', $legumbres->id],
            ['Gelatina', $dulces->id],
            ['Gomas', $dulces->id],
            ['Gomas orion', $dulces->id],
            ['Guantes', $limpieza->id],
            ['Harina arepas', $cereales->id],
            ['Harina trigo', $cereales->id],
            ['Huevos', $huevos->id],
            ['Inhalador', $medicamentos->id],
            ['Instacream', $lacteos->id],
            ['Jabón Liquido manos', $limpieza->id],
            ['Jabón loza', $detergentes->id],
            ['Jabón rey', $limpieza->id],
            ['Lasagna', $pasta->id],
            ['Leche', $lacteos->id],
            ['Lentejas', $legumbres->id],
            ['Limpion', $limpieza->id],
            ['Maíz pira', $cereales->id],
            ['Margarina', $lacteos->id],
            ['Morcilla', $carnes->id],
            ['Mortadela', $carnes->id],
            ['Pan hamburguesa', $panaderia->id],
            ['Pan perro', $panaderia->id],
            ['Pan Sándwich', $panaderia->id],
            ['Panela', $azucar->id],
            ['Papel higiénico', $papelHigienico->id],
            ['Parmesano', $lacteos->id],
            ['Rallador', $limpieza->id],
            ['Ramen', $pasta->id],
            ['Sal', $azucar->id],
            ['Salchichas', $carnes->id],
            ['Salsa soya', $salsas->id],
            ['Salsa teriyaki', $salsas->id],
            ['Saltinas mantequilla', $galletas->id],
            ['Sándwich', $panaderia->id],
            ['Sardinas', $pescado->id],
            ['Shampoo', $aseoPersonal->id],
            ['Spaguetti', $pasta->id],
            ['Tallarines', $pasta->id],
            ['Toalla cocina 660h', $limpieza->id],
            ['Toallas higiénicas', $aseoPersonal->id],
            ['Tostadas', $panaderia->id],
            ['Yogurt', $lacteos->id],

            // Zapatoca - Proteínas/Carnes
            ['Alas de pollo', $pollo->id],
            ['Atún lata', $pescado->id],
            ['Bola de res', $carnes->id],
            ['Churrasco', $carnes->id],
            ['Costilla de cerdo', $carnes->id],
            ['Costilla de res', $carnes->id],
            ['Cuadros de res', $carnes->id],
            ['Carne molida', $carnes->id],
            ['Carne para asar', $carnes->id],
            ['Pechuga de pollo', $pollo->id],
            ['Pollo entero', $pollo->id],
            ['Pierna pernil', $carnes->id],
            ['Pierna de cerdo', $carnes->id],
            ['Sardinas lata', $pescado->id],
            ['Sobrebarriga', $carnes->id],
            ['Tocineta', $carnes->id],
            ['Lomo visceral', $carnes->id],
            ['Cadera de res', $carnes->id],
            ['Frijol cabeza negra', $legumbres->id],
            ['Frijol caraota', $legumbres->id],
            ['Papas bbq', $snacks->id],

            // Alkosto
            ['Tortilla grande', $panaderia->id],

            // Dollarcity
            ['Agua oxigenada', $medicamentos->id],

            // D1
            ['Ajo', $legumbres->id],
            ['Ambientador', $limpieza->id],
            ['Baterías AA', $limpieza->id],
            ['Biso lata', $pescado->id],
            ['Cabano', $carnes->id],
            ['Chocolate kit kat', $chocolate->id],
            ['Color D1', $aseoPersonal->id],
            ['Copitos', $aseoPersonal->id],
            ['Crema de leche', $lacteos->id],
            ['Desodorante', $aseoPersonal->id],
            ['Doritos fake', $snacks->id],
            ['Frijol refrito', $legumbres->id],
            ['Galletas D1', $galletas->id],
            ['Galletas chocolate', $galletas->id],
            ['Galletas club', $galletas->id],
            ['Helado', $lacteos->id],
            ['Jabón líquido azul', $detergentes->id],
            ['Jabón polvo', $detergentes->id],
            ['Limpiatodo', $limpieza->id],
            ['Maíz dulce', $legumbres->id],
            ['Maní divertido', $snacks->id],
            ['Mascarilla', $aseoPersonal->id],
            ['Mayonesa', $salsas->id],
            ['Minibrownies', $dulces->id],
            ['Mostaza', $salsas->id],
            ['Palitos chocolate', $dulces->id],
            ['Pan tajado', $panaderia->id],
            ['Papas fósforos', $snacks->id],
            ['Papas francesas', $snacks->id],
            ['Pasta de tomate', $salsas->id],
            ['Pastillas baño', $limpieza->id],
            ['Perlas fragancia', $limpieza->id],
            ['Pimienta', $azucar->id],
            ['Polvo abrasivo', $limpieza->id],
            ['Pon quesitos', $lacteos->id],
            ['Salsa tomate', $salsas->id],
            ['Suavitel', $limpieza->id],
            ['Tapabocas', $aseoPersonal->id],
            ['Toallas Desinfectante', $limpieza->id],
            ['Toallas humedas', $aseoPersonal->id],
            ['Toallas húmedas mini', $aseoPersonal->id],
            ['Toallas mascotas', $limpieza->id],
            ['Vinagre', $salsas->id],
            ['Barra de chocolate', $chocolate->id],
            ['Bocadillo veleño', $dulces->id],
            ['Yogur griego', $lacteos->id],
            ['Mogolla', $panaderia->id],

            // Don Camilo - Frutas y Verduras
            ['Zanahoria', $verduras->id],
            ['Plátano', $frutas->id],
            ['Guatila', $verduras->id],
            ['Papa', $verduras->id],
            ['Cebolla cabezona blanca', $verduras->id],
            ['Tomate', $verduras->id],
            ['Espinaca', $verduras->id],
            ['Limón', $frutas->id],
            ['Raíces chinas', $verduras->id],
            ['Zuccini', $verduras->id],
            ['Mandarina', $frutas->id],
            ['Banano', $frutas->id],
            ['Arándanos', $frutas->id],
            ['Agraz', $frutas->id],
            ['Aguacate', $frutas->id],
            ['Mora', $frutas->id],
            ['Papa criolla', $verduras->id],
            ['Arveja verde', $legumbres->id],
            ['Lulo', $frutas->id],
            ['Pimentón', $verduras->id],
            ['Lechuga', $verduras->id],
            ['Pepino ensalada', $verduras->id],
            ['Cebolla cabezona roja', $verduras->id],
            ['Cebolla larga', $verduras->id],
            ['Cilantro', $verduras->id],
            ['Brócoli', $verduras->id],
            ['Habichuela', $verduras->id],
            ['Pepino guiso', $verduras->id],
            ['Panela Don Camilo', $azucar->id],
            ['Huevos Don Camilo', $huevos->id],
            ['Manzana', $frutas->id],
            ['Papaya', $frutas->id],
            ['Champiñón', $verduras->id],
            ['Miel', $azucar->id],
            ['Naranja', $frutas->id],
            ['Ajo Don Camilo', $verduras->id],
            ['Mazorca', $verduras->id],
            ['Piña golden', $frutas->id],
            ['Puerro', $verduras->id],
            ['Guayaba', $frutas->id],
            ['Remolacha', $verduras->id],
            ['Yuca', $verduras->id],
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product[0],
                'category_id' => $product[1]
            ]);
        }
    }
}
