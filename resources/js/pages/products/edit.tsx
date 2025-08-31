import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';
import { Place } from '@/types/business/place';
import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';

import ProductForm from '@/components/business/products/productForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Productos',
        href: '/dashboard/products',
    },
    {
        title: 'Editar Producto',
        href: '#',
    },
];

interface ProductEditProps {
    product: Product;
    categories: Category[];
    places: Place[];
    units: Unit[];
}

export default function ProductEdit({ product, categories, places, units }: ProductEditProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${product.name}`} />
            <ProductForm product={product} categories={categories} places={places} units={units} isEdit={true} />
        </AppLayout>
    );
}
