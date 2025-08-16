import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { Category } from '@/types/business/category';

interface Props {
    category: Category;
}

export default function CategoryShow({ category }: Props) {
    return (
        <AppLayout>
            <Head title={`Categoría: ${category.name}`} />
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Detalle de Categoría</h1>
                <div className="mb-2">
                    <strong>Nombre:</strong> {category.name}
                </div>
                <div className="mb-2">
                    <strong>Icono:</strong> {category.icon}
                </div>
                <div className="mb-2">
                    <strong>Color de fondo:</strong>{' '}
                    <span style={{ background: category.bg_color, padding: '2px 8px', borderRadius: '4px', color: category.text_color }}>
                        {category.bg_color}
                    </span>
                </div>
                <div className="mb-2">
                    <strong>Color de texto:</strong> {category.text_color}
                </div>
                <div className="mb-2">
                    <strong>Estado:</strong> {category.enabled ? 'Activo' : 'Inactivo'}
                </div>
                <div className="mt-4">
                    <Link href={route('categories.edit', category.id)} className="mr-4 text-blue-600 hover:underline">
                        Editar
                    </Link>
                    <Link href={route('categories.index')} className="text-gray-600 hover:underline">
                        Volver
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
