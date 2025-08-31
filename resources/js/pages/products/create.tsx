import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';
import { Place } from '@/types/business/place';
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
        title: 'Crear Producto',
        href: '#',
    },
];

interface ProductCreateProps {
    categories: Category[];
    places: Place[];
    units: Unit[];
}

export default function ProductCreate({ categories, places, units }: ProductCreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Producto" />
            <ProductForm categories={categories} places={places} units={units} isEdit={false} />
        </AppLayout>
    );
}
