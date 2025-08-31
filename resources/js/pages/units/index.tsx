import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedUnits } from '@/types/business/unit';

import { Button } from '@/components/ui/button';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { unitActions, unitColumns } from '@/structures/units.struture';
import { Plus } from 'lucide-react';

const breadcrumb: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Unidades', href: '#' },
];

export default function UnitIndex({ units }: { units: PaginatedUnits }) {
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

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable data={units.data} columns={unitColumns} actions={unitActions} emptyMessage="No hay unidades registradas" />
                    </div>

                    <div className="block md:hidden">
                        <DataCards data={units.data} columns={unitColumns} actions={unitActions} emptyMessage="No hay unidades registradas" />
                    </div>

                    {units.data.length > 3 && <Pagination links={units.links} />}
                </div>
            </div>
        </AppLayout>
    );
}
