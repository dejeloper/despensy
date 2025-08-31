import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { Edit, Eye, Trash } from 'lucide-react';
import { Product } from '../types/business/product';

import { Badge } from '@/components/ui/badge';

export const productColumns: Column<Product>[] = [
    { key: 'name', label: 'Nombre' },
    {
        key: 'category_id',
        label: 'Categoría',
        render: (product) => {
            return product.category_id ? (
                <div className="flex items-center justify-center">
                    <Badge
                        className="flex min-w-[120px] items-center gap-2 px-4 py-2 font-black"
                        style={{
                            backgroundColor: product.category?.bg_color || undefined,
                            color: product.category?.text_color || undefined,
                        }}
                    >
                        {product.category?.icon} {product.category?.name}
                    </Badge>
                </div>
            ) : (
                'Sin categoría'
            );
        },
    },
    {
        key: 'place_id',
        label: 'Lugar',
        render: (product) => {
            return product.place_id ? (
                <div className="flex items-center justify-center">
                    <Badge
                        className="flex min-w-[120px] items-center gap-2 px-4 py-2 font-black"
                        style={{
                            backgroundColor: product.place?.bg_color || undefined,
                            color: product.place?.text_color || undefined,
                        }}
                    >
                        {product.place?.name}
                    </Badge>
                </div>
            ) : (
                'Sin lugar'
            );
        },
    },
    {
        key: 'unit_id',
        label: 'Unidad',
        render: (product) => {
            return product.unit_id ? (
                <div className="flex items-center justify-center">
                    <Badge variant="outline" className="flex min-w-[120px] items-center gap-2 px-4 py-2 font-black">
                        {product.unit?.name}
                    </Badge>
                </div>
            ) : (
                'Sin unidad'
            );
        },
    },
];

export const productActions: Action<Product>[] = [
    {
        title: 'Ver Producto',
        icon: <Eye />,
        onClick: (p) => router.visit(route('products.show', p.id)),
    },
    {
        title: 'Editar Producto',
        icon: <Edit />,
        onClick: (p) => router.visit(route('products.edit', p.id)),
    },
    {
        title: 'Eliminar Producto',
        icon: <Trash />,
        variant: 'destructive',
        onClick: (p) => {
            if (confirm(`¿Seguro que deseas eliminar "${p.name}"?`)) {
                router.delete(route('products.destroy', p.id));
            }
        },
    },
];
