import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedChecklist } from '@/types/business/checklist';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { SearchBar } from '@/components/shared/searchbar.component';
import { useClientPagination } from '@/hooks/use-client-pagination';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { checklistActions, checklistColumns } from '@/structures/checklists.structure';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Listas de compra', href: '#' },
];

export default function ChecklistIndex({ checklists }: { checklists: PaginatedChecklist }) {
    const isLoading = useInertiaLoading();
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, reset } = useForm({ name: '' });

    const { paginatedData, paginationLinks, handlePageChange } = useClientPagination({
        data: checklists.data,
        itemsPerPage: 10,
        searchTerm,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('checklists.store'), { onSuccess: () => reset() });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listas de compra" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Listas de compra</h1>
                    <Link href={route('despensy.index')}>
                        <Button variant="outline" size="sm">
                            Ver lista activa
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="flex items-end gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Nombre de la lista (opcional)"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                />
                            </div>
                            <Button type="submit" disabled={processing}>
                                <Plus className="mr-1 h-4 w-4" /> Nueva lista
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar listas..." />

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={paginatedData}
                            columns={checklistColumns}
                            actions={checklistActions}
                            emptyMessage="No hay listas de compra registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={paginatedData}
                            columns={checklistColumns}
                            actions={checklistActions}
                            emptyMessage="No hay listas de compra registradas"
                            isLoading={isLoading}
                        />
                    </div>

                    {!isLoading && paginationLinks.length > 0 && <Pagination links={paginationLinks} onPageChange={handlePageChange} />}
                </div>
            </div>
        </AppLayout>
    );
}
