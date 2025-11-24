import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { PaginatedConsumer } from '@/types/business/consumer';
import { Button } from '@/components/ui/button';
import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { consumerActions, consumerColumns } from '@/structures/consumers.structure';
import { Plus } from 'lucide-react';

const breadcrumb: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Consumidores', href: '#' },
];

export default function ConsumerIndex({ consumers }: { consumers: PaginatedConsumer }) {
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Consumidores" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Consumidores</h1>
                    <Button asChild size="sm">
                        <Link href={route('consumers.create')}>
                            <Plus className="mr-1 h-4 w-4" /> Crear Consumidor
                        </Link>
                    </Button>
                </div>

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable data={consumers.data} columns={consumerColumns} actions={consumerActions} emptyMessage="No hay consumidores registrados" />
                    </div>

                    <div className="block md:hidden">
                        <DataCards data={consumers.data} columns={consumerColumns} actions={consumerActions} emptyMessage="No hay consumidores registrados" />
                    </div>

                    {consumers.data.length > 3 && <Pagination links={consumers.links} />}
                </div>
            </div>
        </AppLayout>
    );
}
