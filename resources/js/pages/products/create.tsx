import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';

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
}

export default function ProductCreate({ categories }: ProductCreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Producto" />
            <ProductForm categories={categories} isEdit={false} />
        </AppLayout>
    );
}
