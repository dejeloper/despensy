import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { checklistActions, checklistColumns } from '@/structures/checklists.structure';
import { BreadcrumbItem } from '@/types';
import { PaginatedChecklist } from '@/types/business/checklist';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Checklists', href: '#' },
];

export default function ChecklistIndex({ checklists }: { checklists: PaginatedChecklist }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Checklists" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Checklists</h1>
                    <Button asChild size="sm">
                        <Link href={route('checklists.create')}>
                            <Plus className="mr-1 h-4 w-4" /> Crear Checklist
                        </Link>
                    </Button>
                </div>

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={checklists.data}
                            columns={checklistColumns}
                            actions={checklistActions}
                            emptyMessage="No hay Checklists registrados"
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={checklists.data}
                            columns={checklistColumns}
                            actions={checklistActions}
                            emptyMessage="No hay Checklists registrados"
                        />
                    </div>

                    {checklists.data.length > 3 && <Pagination links={checklists.links} />}
                </div>
            </div>
        </AppLayout>
    );
}
