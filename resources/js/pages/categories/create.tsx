import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import CategoryForm from '@/components/business/categories/categoryForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Categorías',
        href: '/dashboard/categories',
    },
    {
        title: 'Crear Categoría',
        href: '#',
    },
];

export default function CategoryCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Categoría" />
            <CategoryForm category={{}} isEdit={false} isView={false} />
        </AppLayout>
    );
}
