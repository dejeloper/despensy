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
        title: 'Ver Categoría',
        href: '#',
    },
];

export default function CategoryShow({ category }: { category: Category }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category.name} />
            <CategoryForm category={category} isEdit={false} isView={true} />
        </AppLayout>
    );
}
