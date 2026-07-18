import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { Edit, Eye, Trash } from 'lucide-react';
import { Product } from '../types/business/product';

import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export const productColumns: Column<Product>[] = [
    { key: 'name', label: 'Nombre' },
    {
        key: 'category_id',
        label: 'Categoría',
        render: (product) => {
            return product.category_id ? (
                <div className="flex items-center justify-center">
                    <ColorBadge
                        text={product.category?.name ?? ''}
                        icon={product.category?.icon}
                        bgColor={product.category?.bg_color}
                        textColor={product.category?.text_color}
                    />
                </div>
            ) : (
                'Sin categoría'
            );
        },
    },
    {
        key: 'last_place_name',
        label: 'Lugar',
        render: (product) => {
            return product.last_place_name ? (
                <div className="flex items-center justify-center">
                    <ColorBadge text={product.last_place_name} bgColor={product.last_place_bg_color} textColor={product.last_place_text_color} />
                </div>
            ) : (
                <div className="text-center text-gray-400">Sin lugar</div>
            );
        },
    },
    {
        key: 'last_price',
        label: 'Precio',
        render: (product) => {
            return product.last_price ? (
                <div className="text-center font-semibold text-green-600">{formatCurrency(product.last_price)}</div>
            ) : (
                <div className="text-center text-gray-400">Sin precio</div>
            );
        },
    },
    {
        key: 'last_unit_name',
        label: 'Unidad',
        render: (product) => {
            return product.last_unit_name ? (
                <div className="flex items-center justify-center">
                    <Badge variant="outline" className="flex min-w-[120px] items-center gap-2 px-4 py-2">
                        {product.last_unit_name}
                    </Badge>
                </div>
            ) : (
                <div className="text-center text-gray-400">Sin unidad</div>
            );
        },
    },
];

export const productActions: Action<Product>[] = [
    {
        title: 'Ver Detalle',
        icon: <Eye />,
        variant: 'ghost',
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
