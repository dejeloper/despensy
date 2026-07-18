import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';
import { Place } from '@/types/business/place';
import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ProductDespensaModal } from '@/components/business/despensy/productDespensaModal';
import { DataCards } from '@/components/shared/datacards.component';
import { DataTable } from '@/components/shared/datatable.component';
import { Pagination } from '@/components/shared/pagination.component';
import { SearchBar } from '@/components/shared/searchbar.component';
import { useClientPagination } from '@/hooks/use-client-pagination';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { despensyColumns } from '@/structures/despensy.structure';
import { Action } from '@/types/ui';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Despensa', href: '#' }];

interface DespensyProps {
    products: Product[];
    categories: Category[];
    units: Unit[];
    places: Place[];
    checklist: { id: number; name: string | null; updated_at: string | null; state: { name: string; color: string | null } };
    checklistIsStale: boolean;
}

type ListFilter = 'all' | 'in_list' | 'out_of_list';

export default function DespensyIndex({ products, categories, units, places, checklist, checklistIsStale }: DespensyProps) {
    const isLoading = useInertiaLoading();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [listFilter, setListFilter] = useState<ListFilter>('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [staleDialogOpen, setStaleDialogOpen] = useState(checklistIsStale);

    const facetedProducts = useMemo(() => {
        return products.filter((product) => {
            if (categoryFilter !== 'all' && product.category_id?.toString() !== categoryFilter) return false;
            if (listFilter === 'in_list' && !product.active_checklist_item_id) return false;
            if (listFilter === 'out_of_list' && product.active_checklist_item_id) return false;
            return true;
        });
    }, [products, categoryFilter, listFilter]);

    const { paginatedData, paginationLinks, handlePageChange } = useClientPagination({
        data: facetedProducts,
        itemsPerPage: 10,
        searchTerm,
    });

    const openProductModal = (product: Product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const despensyActions: Action<Product>[] = [
        {
            title: 'Ver / agregar a la lista',
            icon: <Eye />,
            onClick: openProductModal,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Despensa" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Despensa</h1>
                        <Badge style={{ backgroundColor: checklist.state.color || undefined }}>
                            {checklist.name || `Lista #${checklist.id}`} · {checklist.state.name}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild size="sm">
                            <Link href={route('checkout.index')}>Registrar compra</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.post(route('checklists.complete', checklist.id))}>
                            Cerrar lista
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                if (confirm('¿Cancelar esta lista?')) router.post(route('checklists.cancel', checklist.id));
                            }}
                        >
                            Cancelar lista
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar productos..." />

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id!.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={listFilter} onValueChange={(value) => setListFilter(value as ListFilter)}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="in_list">En lista</SelectItem>
                            <SelectItem value="out_of_list">Fuera de lista</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full">
                    <div className="hidden md:block">
                        <DataTable
                            data={paginatedData}
                            columns={despensyColumns}
                            actions={despensyActions}
                            emptyMessage="No hay productos registrados"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="block md:hidden">
                        <DataCards
                            data={paginatedData}
                            columns={despensyColumns}
                            actions={despensyActions}
                            emptyMessage="No hay productos registrados"
                            isLoading={isLoading}
                        />
                    </div>

                    {!isLoading && paginationLinks.length > 0 && <Pagination links={paginationLinks} onPageChange={handlePageChange} />}
                </div>
            </div>

            <ProductDespensaModal product={selectedProduct} units={units} places={places} open={modalOpen} onOpenChange={setModalOpen} />

            <Dialog open={staleDialogOpen} onOpenChange={setStaleDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tu lista de compra lleva más de 15 días abierta</DialogTitle>
                        <DialogDescription>¿Quieres seguir usándola o prefieres cerrarla y empezar una nueva?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStaleDialogOpen(false)}>
                            Continuar con esta lista
                        </Button>
                        <Button
                            onClick={() => {
                                router.post(route('despensy.checklist.renew'), undefined, {
                                    onFinish: () => setStaleDialogOpen(false),
                                });
                            }}
                        >
                            Crear una nueva
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
