import { Head } from '@inertiajs/react';

import CategoryForm from '@/components/business/categories/categoryForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';

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
        title: 'Editar Categoría',
        href: '#',
    },
];

export default function CategoryEdit({ category }: { category: Category }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${category.name}`} />
            <CategoryForm category={category} isEdit={true} />
        </AppLayout>
    );
}
