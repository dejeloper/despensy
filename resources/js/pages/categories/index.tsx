import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { PaginatedCategories } from '@/types/business/category';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { categoryActions, categoryColumns } from '@/structures/categories.structure';
import { Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Categorías', href: '#' },
];

interface CategoryIndexProps {
    categories: PaginatedCategories;
}

const ITEMS_PER_PAGE = 10;

export default function CategoryIndex({ categories }: CategoryIndexProps) {
    const isLoading = useInertiaLoading();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return categories.data;

        const term = searchTerm.toLowerCase();

        return categories.data.filter((item) => {
            return Object.values(item).some((value) => {
                if (value === null || value === undefined) return false;

                return String(value).toLowerCase().includes(term);
            });
        });
    }, [categories.data, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginationLinks = useMemo(() => {
        if (totalPages <= 1) return [];

        const links = [
            {
                url: currentPage > 1 ? '#' : null,
                label: '&laquo; Anterior',
                active: false,
            },
        ];

        for (let i = 1; i <= totalPages; i++) {
            links.push({
                url: '#',
                label: String(i),
                active: i === currentPage,
            });
        }

        links.push({
            url: currentPage < totalPages ? '#' : null,
            label: 'Siguiente &raquo;',
            active: false,
        });

        return links;
    }, [currentPage, totalPages]);

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

                {/* Campo de búsqueda */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar categorías..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-9 pl-9"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            title="Limpiar búsqueda"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

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
