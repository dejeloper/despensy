import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { BreadcrumbItem } from '@/types';
import { PaginatedProduct } from '@/types/business/product';

import { Button } from '@/components/ui/button';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { SearchBar } from '@/components/shared/searchbar.component';
import { useClientPagination } from '@/hooks/use-client-pagination';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { productActions, productColumns } from '@/structures/products.structure';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Productos', href: '#' },
];

export default function ProductIndex({ products }: { products: PaginatedProduct }) {
    const isLoading = useInertiaLoading();
    const [searchTerm, setSearchTerm] = useState('');

    const { paginatedData, paginationLinks, handlePageChange } = useClientPagination({
        data: products.data,
        itemsPerPage: 10,
        searchTerm,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
                    <Button asChild size="sm">
                        <Link href={route('products.create')}>
                            <Plus className="mr-1 h-4 w-4" /> Crear Producto
                        </Link>
                    </Button>
                </div>

                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar productos..." />

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={paginatedData}
                            columns={productColumns}
                            actions={productActions}
                            emptyMessage="No hay Productos registrados"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={paginatedData}
                            columns={productColumns}
                            actions={productActions}
                            emptyMessage="No hay Productos registrados"
                            isLoading={isLoading}
                        />
                    </div>

                    {!isLoading && paginationLinks.length > 0 && <Pagination links={paginationLinks} onPageChange={handlePageChange} />}
                </div>
            </div>
        </AppLayout>
    );
}
