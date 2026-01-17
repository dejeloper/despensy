import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedCategories } from '@/types/business/category';

import { Button } from '@/components/ui/button';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { SearchBar } from '@/components/shared/searchbar.component';
import { useClientPagination } from '@/hooks/use-client-pagination';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { categoryActions, categoryColumns } from '@/structures/categories.structure';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Categorías', href: '#' },
];

interface CategoryIndexProps {
    categories: PaginatedCategories;
}

export default function CategoryIndex({ categories }: CategoryIndexProps) {
    const isLoading = useInertiaLoading();
    const [searchTerm, setSearchTerm] = useState('');

    const { paginatedData, paginationLinks, handlePageChange } = useClientPagination({
        data: categories.data,
        itemsPerPage: 10,
        searchTerm,
    });

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

                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar categorías..." />

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={paginatedData}
                            columns={categoryColumns}
                            actions={categoryActions}
                            emptyMessage="No hay categorías registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={paginatedData}
                            columns={categoryColumns}
                            actions={categoryActions}
                            emptyMessage="No hay categorías registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    {!isLoading && paginationLinks.length > 0 && <Pagination links={paginationLinks} onPageChange={handlePageChange} />}
                </div>
            </div>
        </AppLayout>
    );
}
