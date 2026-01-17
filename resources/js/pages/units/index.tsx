import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedUnits } from '@/types/business/unit';

import { Button } from '@/components/ui/button';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { SearchBar } from '@/components/shared/searchbar.component';
import { useClientPagination } from '@/hooks/use-client-pagination';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { unitActions, unitColumns } from '@/structures/units.struture';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumb: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Unidades', href: '#' },
];

export default function UnitIndex({ units }: { units: PaginatedUnits }) {
    const isLoading = useInertiaLoading();
    const [searchTerm, setSearchTerm] = useState('');

    const { paginatedData, paginationLinks, handlePageChange } = useClientPagination({
        data: units.data,
        itemsPerPage: 10,
        searchTerm,
    });

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Unidades" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Unidades</h1>
                    <Button asChild size="sm">
                        <Link href={route('units.create')}>
                            <Plus className="mr-1 h-4 w-4" /> Crear Unidad
                        </Link>
                    </Button>
                </div>

                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar unidades..." />

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={paginatedData}
                            columns={unitColumns}
                            actions={unitActions}
                            emptyMessage="No hay unidades registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={paginatedData}
                            columns={unitColumns}
                            actions={unitActions}
                            emptyMessage="No hay unidades registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    {!isLoading && paginationLinks.length > 0 && <Pagination links={paginationLinks} onPageChange={handlePageChange} />}
                </div>
            </div>
        </AppLayout>
    );
}
