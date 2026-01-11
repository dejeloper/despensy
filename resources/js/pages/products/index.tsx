import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { BreadcrumbItem } from '@/types';
import { PaginatedProduct } from '@/types/business/product';

import { Button } from '@/components/ui/button';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { productActions, productColumns } from '@/structures/products.structure';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Productos', href: '#' },
];

export default function ProductIndex({ products }: { products: PaginatedProduct }) {
    const isLoading = useInertiaLoading();

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

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={products.data}
                            columns={productColumns}
                            actions={productActions}
                            emptyMessage="No hay Productos registrados"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={products.data}
                            columns={productColumns}
                            actions={productActions}
                            emptyMessage="No hay Productos registrados"
                            isLoading={isLoading}
                        />
                    </div>

                    {!isLoading && products.data.length > 3 && <Pagination links={products.links} />}
                </div>
            </div>
        </AppLayout>
    );
}
