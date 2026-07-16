import { Column } from '@/types/ui';

import { Badge } from '@/components/ui/badge';
import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Product } from '@/types/business/product';

export const despensyColumns: Column<Product>[] = [
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
        key: 'last_price',
        label: 'Última compra',
        render: (product) => {
            if (!product.last_price) {
                return <div className="text-center text-gray-400">Sin compras</div>;
            }

            return (
                <div className="text-center">
                    <div className="font-semibold text-green-600">${product.last_price}</div>
                    {product.last_place_name && <div className="text-xs text-muted-foreground">{product.last_place_name}</div>}
                </div>
            );
        },
    },
    {
        key: 'active_checklist_item_id',
        label: 'Estado',
        render: (product) => {
            return (
                <div className="flex items-center justify-center">
                    {product.active_checklist_item_id ? (
                        <Badge className="bg-green-600 text-white">En lista</Badge>
                    ) : (
                        <Badge variant="outline">Fuera de lista</Badge>
                    )}
                </div>
            );
        },
    },
];
