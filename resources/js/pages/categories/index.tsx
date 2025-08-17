import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedCategories } from '@/types/business/category';

import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/Pagination';
import { categoryActions, categoryColumns } from '@/structures/categories.structure';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Categorías', href: '#' },
];

export default function CategoryIndex({ categories }: { categories: PaginatedCategories }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorías" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
                    <Button asChild size="sm">
                        <Link href={route('categories.create')}>
                            <Plus className="mr-1 h-4 w-4" /> Crear Categoría
                        </Link>
                    </Button>
                </div>

                <DataTable data={categories.data} columns={categoryColumns} actions={categoryActions} emptyMessage="No hay categorías registradas" />

                <Pagination links={categories.links} />
            </div>
        </AppLayout>
    );
}
