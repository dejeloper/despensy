import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedCategories } from '@/types/business/category';

import { Button } from '@/components/ui/button';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { categoryActions, categoryColumns } from '@/structures/categories.structure';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Categorías', href: '#' },
];

export default function CategoryIndex({ categories }: { categories: PaginatedCategories }) {
    const isLoading = useInertiaLoading();

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

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={categories.data}
                            columns={categoryColumns}
                            actions={categoryActions}
                            emptyMessage="No hay categorías registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={categories.data}
                            columns={categoryColumns}
                            actions={categoryActions}
                            emptyMessage="No hay categorías registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    {!isLoading && categories.data.length > 3 && <Pagination links={categories.links} />}
                </div>
            </div>
        </AppLayout>
    );
}
