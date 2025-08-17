<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlaceSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{

		$places = [
			['Supermercado Zapatoca', 'Zapatoca Centro', 'Centro de Mosquera', '#ff0000', '#ffffff', 'No olvidar los sanduchitos'],
			['Supermercado La Granja', 'La Granja', 'Mosquera Norte', '#ff9800', '#ffffff', 'Comprar frutas frescas'],
			['Supermercado El Mercado', 'El Mercado', 'Calle 13 Bogotá', '#4caf50', '#ffffff', 'Verduras de temporada'],
			['Supermercado La Bodega', 'La Bodega', 'Funza Centro', '#3f51b5', '#ffffff', 'Quesos y embutidos'],
			['Supermercado El Rincón', 'El Rincón', 'Madrid Cundinamarca', '#795548', '#ffffff', 'Pan fresco en la mañana'],
			['Supertienda Olímpica', 'Olímpica', 'Bogotá Kennedy', '#2196f3', '#ffffff', 'Promos de lácteos'],
			['Supermercado Colsubsidio', 'Colsubsidio', 'Mosquera Variante', '#673ab7', '#ffffff', 'Aprovechar descuentos con tarjeta'],
			['Éxito Express', 'Éxito', 'Bogotá Calle 80', '#fdd835', '#000000', 'Cereal y productos importados'],
			['Ara', 'Ara', 'Mosquera Centro', '#e91e63', '#ffffff', 'Ofertas de embutidos'],
			['D1', 'D1', 'Funza Avenida 7', '#009688', '#ffffff', 'Snacks baratos'],
			['Jumbo', 'Jumbo', 'Centro Mayor Bogotá', '#388e3c', '#ffffff', 'Carnes premium'],
			['Carulla', 'Carulla', 'Chía Autopista Norte', '#2e7d32', '#ffffff', 'Productos gourmet'],
			['Supermercado El Dorado', 'El Dorado', 'Mosquera El Poblado', '#ff5722', '#ffffff', 'Comprar arroz y granos'],
			['Tiendas Metro', 'Metro', 'Bogotá Calle 26', '#c2185b', '#ffffff', 'Bebidas y jugos'],
			['Tiendas Justo & Bueno', 'JustoBueno', 'Mosquera Sur', '#00acc1', '#ffffff', 'Aprovechar combos económicos'],
			['Supermercado El Campesino', 'Campesino', 'Mosquera Rural', '#8bc34a', '#000000', 'Frutas directas del campo'],
			['Mercamío', 'Mercamío', 'Funza Norte', '#ff7043', '#ffffff', 'Legumbres y huevos'],
			['La Canasta Familiar', 'La Canasta', 'Mosquera Calle 15', '#9c27b0', '#ffffff', 'Aceites y productos de aseo'],
			['Supermercado Los Andes', 'Los Andes', 'Madrid Centro', '#607d8b', '#ffffff', 'Dulces y paquetes'],
			['Makro', 'Makro', 'Calle 80 Bogotá', '#ffca28', '#000000', 'Compras al por mayor'],
		];

		$data = array_map(fn($p) => [
			'name'       => $p[0],
			'short_name' => $p[1],
			'address'    => $p[2],
			'bg_color'   => $p[3],
			'text_color' => $p[4],
			'note'       => $p[5],
		], $places);

		DB::table('places')->insert($data);
	}
}
