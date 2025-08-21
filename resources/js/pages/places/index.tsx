import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedPlaces } from '@/types/business/place';

import { Button } from '@/components/ui/button';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { placeActions, placeColumns } from '@/structures/places.structure';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Lugares', href: '#' },
];

export default function PlaceIndex({ places }: { places: PaginatedPlaces }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lugares" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Lugares</h1>
                    <Button asChild size="sm">
                        <Link href={route('places.create')}>
                            <Plus className="mr-1 h-4 w-4" /> Crear Lugar
                        </Link>
                    </Button>
                </div>

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable data={places.data} columns={placeColumns} actions={placeActions} emptyMessage="No hay lugares registrados" />
                    </div>

                    <div className="block md:hidden">
                        <DataCards data={places.data} columns={placeColumns} actions={placeActions} emptyMessage="No hay lugares registrados" />
                    </div>

                    <Pagination links={places.links} />
                </div>
            </div>
        </AppLayout>
    );
}
