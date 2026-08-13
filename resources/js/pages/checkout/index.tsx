import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';
import { ChecklistItem } from '@/types/business/checklist';
import { ProductContainer } from '@/types/business/equivalence';
import { Place } from '@/types/business/place';
import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';

import { AddOutOfListProductModal } from '@/components/business/checkout/addOutOfListProductModal';
import { ConversionSetupModal } from '@/components/business/checkout/conversionSetupModal';
import { PlaceSummaryCard } from '@/components/business/checkout/placeSummaryCard';
import { CategoryFilterSelect } from '@/components/shared/categoryFilterSelect.component';
import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Money } from '@/components/shared/money.component';
import { Pagination } from '@/components/shared/pagination.component';
import { QuantityInput } from '@/components/shared/quantityInput.component';
import { SearchBar } from '@/components/shared/searchbar.component';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryFilter } from '@/hooks/use-category-filter';
import { useClientPagination } from '@/hooks/use-client-pagination';
import { cn, formatQuantity, formatUnitPrice, normalizeDecimal, normalizeText } from '@/lib/utils';
import { Check, LoaderCircle, Pencil } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Despensa', href: route('despensy.index') },
    { title: 'Registrar compra', href: '#' },
];

const ITEMS_PER_PAGE = 10;

type CheckoutTab = 'pending' | 'confirmed';

const itemProductName = (item: ChecklistItem) => item.product?.name ?? '';
const itemCategoryId = (item: ChecklistItem) => item.product?.category?.id;

function countMatching(items: ChecklistItem[], searchTerm: string): number {
    if (!searchTerm.trim()) return items.length;

    const term = normalizeText(searchTerm);

    return items.filter((item) => normalizeText(itemProductName(item)).includes(term)).length;
}

interface CheckoutProps {
    checklist: { id: number; name: string | null };
    items: ChecklistItem[];
    boughtItems: ChecklistItem[];
    places: Place[];
    units: Unit[];
    products: Product[];
    categories: Category[];
    productContainers: ProductContainer[];
}

function CheckoutItemRow({ item, units, placeId }: { item: ChecklistItem; units: Unit[]; placeId: string }) {
    const { data, setData, patch, transform, processing, errors } = useForm({
        quantity_bought: item.quantity_planned?.toString() || '1',
        unit_id_bought: item.unit_planned?.id?.toString() || '',
        total_price: '',
    });

    const unitItems: ComboboxItem[] = units.map((u) => ({ value: u.id.toString(), label: u.name, searchText: `${u.name} ${u.name}` }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        transform((formData) => ({ ...formData, quantity_bought: normalizeDecimal(formData.quantity_bought), place_id: placeId }));
        patch(route('checklist-items.mark-bought', item.id), { preserveScroll: true, preserveState: true });
    };

    return (
        <form
            onSubmit={submit}
            className="flex flex-col gap-3 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50 sm:p-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4"
        >
            <div className="min-w-0 lg:w-1/2">
                <p className="truncate text-base font-semibold">{item.product?.name}</p>
                {item.product?.category && (
                    <ColorBadge
                        text={item.product.category.name}
                        icon={item.product.category.icon}
                        bgColor={item.product.category.bg_color}
                        textColor={item.product.category.text_color}
                        className="mt-1 min-w-0 px-2 py-0.5 text-xs font-medium"
                    />
                )}
            </div>
            <div className="flex flex-wrap items-end gap-2 lg:w-1/2 lg:flex-nowrap lg:justify-end">
                <div className="w-24">
                    <QuantityInput value={data.quantity_bought} onChange={(value) => setData('quantity_bought', value)} required />
                    {errors.quantity_bought && <p className="mt-1 text-xs text-destructive">{errors.quantity_bought}</p>}
                </div>
                <div className="w-32">
                    <Combobox
                        items={unitItems}
                        value={data.unit_id_bought}
                        onValueChange={(value) => setData('unit_id_bought', value)}
                        placeholder="Unidad"
                        searchPlaceholder="Buscar unidad..."
                        emptyText="No se encontraron unidades"
                        className="w-full"
                    />
                    {errors.unit_id_bought && <p className="mt-1 text-xs text-destructive">{errors.unit_id_bought}</p>}
                </div>
                <div className="w-28">
                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="Precio total"
                        value={data.total_price}
                        onChange={(e) => setData('total_price', e.target.value)}
                        required
                    />
                    {errors.total_price && <p className="mt-1 text-xs text-destructive">{errors.total_price}</p>}
                </div>
                <Button
                    type="submit"
                    size="icon"
                    className="shrink-0"
                    title="Confirmar compra"
                    disabled={processing || !placeId || !data.quantity_bought || !data.unit_id_bought || !data.total_price}
                >
                    {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
            </div>
        </form>
    );
}

function EditBoughtItemModal({
    item,
    units,
    places,
    open,
    onOpenChange,
}: {
    item: ChecklistItem;
    units: Unit[];
    places: Place[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [unconfirming, setUnconfirming] = useState(false);
    // State (not useRef) so the DialogContent's mount triggers a re-render —
    // a ref alone stays null through the render that creates it.
    const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

    const { data, setData, patch, processing, errors, reset, transform } = useForm({
        quantity_bought: item.quantity_bought?.toString() || '',
        unit_id_bought: item.unit_bought?.id?.toString() || '',
        place_id: item.place?.id?.toString() || '',
        total_price: item.total_price?.toString() || '',
    });

    const unitItems: ComboboxItem[] = units.map((u) => ({ value: u.id.toString(), label: u.name, searchText: `${u.name} ${u.name}` }));
    const placeItems: ComboboxItem[] = places.map((p) => ({ value: p.id!.toString(), label: p.name }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        transform((formData) => ({ ...formData, quantity_bought: normalizeDecimal(formData.quantity_bought) }));
        patch(route('checklist-items.mark-bought', item.id), { preserveScroll: true, onSuccess: () => onOpenChange(false) });
    };

    const unconfirm = () => {
        if (!confirm(`¿Quitar la confirmación de compra de "${item.product?.name}"? Volverá a la lista de pendientes.`)) return;
        setUnconfirming(true);
        router.patch(route('checklist-items.mark-not-bought', item.id), undefined, {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
            onFinish: () => setUnconfirming(false),
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) reset();
                onOpenChange(value);
            }}
        >
            <DialogContent className="overflow-visible sm:max-w-md" ref={setContentEl}>
                <DialogHeader>
                    <DialogTitle>Editar compra</DialogTitle>
                    <DialogDescription>{item.product?.name}</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <div className="w-24">
                            <QuantityInput value={data.quantity_bought} onChange={(value) => setData('quantity_bought', value)} required />
                            {errors.quantity_bought && <p className="mt-1 text-xs text-destructive">{errors.quantity_bought}</p>}
                        </div>
                        <div className="flex-1">
                            <Combobox
                                items={unitItems}
                                value={data.unit_id_bought}
                                onValueChange={(value) => setData('unit_id_bought', value)}
                                placeholder="Unidad"
                                searchPlaceholder="Buscar unidad..."
                                emptyText="No se encontraron unidades"
                                portalContainer={contentEl}
                            />
                            {errors.unit_id_bought && <p className="mt-1 text-xs text-destructive">{errors.unit_id_bought}</p>}
                        </div>
                    </div>

                    <div>
                        <Combobox
                            items={placeItems}
                            value={data.place_id}
                            onValueChange={(value) => setData('place_id', value)}
                            placeholder="Lugar"
                            searchPlaceholder="Buscar lugar..."
                            emptyText="No se encontraron lugares"
                            portalContainer={contentEl}
                        />
                        {errors.place_id && <p className="mt-1 text-xs text-destructive">{errors.place_id}</p>}
                    </div>

                    <div>
                        <Input
                            type="number"
                            min={0}
                            step="1"
                            placeholder="Precio total"
                            value={data.total_price}
                            onChange={(e) => setData('total_price', e.target.value)}
                            required
                        />
                        {errors.total_price && <p className="mt-1 text-xs text-destructive">{errors.total_price}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={unconfirm} disabled={processing || unconfirming}>
                            {unconfirming && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Quitar
                        </Button>
                        <Button type="submit" disabled={processing || unconfirming}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function BoughtItemRow({ item, units, places, containers }: { item: ChecklistItem; units: Unit[]; places: Place[]; containers: ProductContainer[] }) {
    const [editOpen, setEditOpen] = useState(false);
    const [setupOpen, setSetupOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50 sm:p-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-2">
            <div className="min-w-0 lg:flex-1">
                <p className="truncate text-base font-semibold">{item.product?.name}</p>
                {item.product?.category && (
                    <ColorBadge
                        text={item.product.category.name}
                        icon={item.product.category.icon}
                        bgColor={item.product.category.bg_color}
                        textColor={item.product.category.text_color}
                        className="mt-1 min-w-0 px-2 py-0.5 text-xs font-medium"
                    />
                )}
            </div>
            <div className="flex items-center justify-between gap-2 lg:justify-end">
                <p className="text-sm text-muted-foreground">
                    {formatQuantity(item.quantity_bought)} {item.unit_bought?.short_name}
                    {item.product && (
                        <button
                            type="button"
                            onClick={() => setSetupOpen(true)}
                            className="align-super text-xs hover:cursor-pointer hover:text-foreground hover:underline hover:underline-offset-2"
                            title={
                                item.needs_conversion_setup
                                    ? `Debe configurar ${item.unit_bought?.name} para conversión`
                                    : `Editar la equivalencia de ${item.unit_bought?.name}`
                            }
                        >
                            °
                        </button>
                    )}
                </p>
                <div className="text-right">
                    <Money value={item.total_price} />
                    {item.conversion && item.conversion.unit_price !== null && (
                        <p className="text-xs text-muted-foreground">
                            {formatUnitPrice(item.conversion.unit_price)}/{item.conversion.unit_short_name}
                        </p>
                    )}
                </div>
                <Button type="button" variant="outline" size="icon" title="Editar" onClick={() => setEditOpen(true)}>
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>

            <EditBoughtItemModal item={item} units={units} places={places} open={editOpen} onOpenChange={setEditOpen} />

            {item.product && (
                <ConversionSetupModal
                    productId={item.product.id}
                    productName={item.product.name}
                    defaultContainerUnitId={item.unit_bought?.id}
                    containers={containers}
                    units={units}
                    places={places}
                    open={setupOpen}
                    onOpenChange={setSetupOpen}
                />
            )}
        </div>
    );
}

function BoughtItemsList({
    boughtItems,
    units,
    places,
    categories,
    containers,
    searchTerm,
}: {
    boughtItems: ChecklistItem[];
    units: Unit[];
    places: Place[];
    categories: Category[];
    containers: ProductContainer[];
    searchTerm: string;
}) {
    const [placeFilter, setPlaceFilter] = useState<string>('all');

    const placeFilteredItems = useMemo(() => {
        if (placeFilter === 'all') return boughtItems;

        return boughtItems.filter((item) => item.place?.id?.toString() === placeFilter);
    }, [boughtItems, placeFilter]);

    const { categoryFilter, setCategoryFilter, filteredItems: categoryFilteredItems } = useCategoryFilter(placeFilteredItems, itemCategoryId);

    const { paginatedData, filteredData, paginationLinks, handlePageChange } = useClientPagination({
        data: categoryFilteredItems,
        itemsPerPage: ITEMS_PER_PAGE,
        searchTerm,
        sortKey: itemProductName,
        searchText: itemProductName,
    });

    const totalConfirmed = useMemo(() => {
        return filteredData.reduce((sum, item) => sum + Number(item.total_price ?? 0), 0);
    }, [filteredData]);

    if (boughtItems.length === 0) {
        return <p className="p-4 text-sm text-muted-foreground">Todavía no has confirmado ningún producto.</p>;
    }

    return (
        <div className="relative flex flex-col gap-2 overflow-x-auto">
            <div className="flex flex-col items-start gap-2 p-3 pb-0">
                <p className="font-medium">
                    Productos Confirmados ({filteredData.length}) · Total: <Money value={totalConfirmed} />
                </p>
                <div className="flex flex-wrap gap-2">
                    <Select value={placeFilter} onValueChange={setPlaceFilter}>
                        <SelectTrigger className="w-auto whitespace-nowrap">
                            <SelectValue placeholder="Lugar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los lugares</SelectItem>
                            {places.map((place) => (
                                <SelectItem key={place.id} value={place.id!.toString()}>
                                    {place.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <CategoryFilterSelect categories={categories} value={categoryFilter} onValueChange={setCategoryFilter} />
                </div>
            </div>

            <PlaceSummaryCard boughtItems={filteredData} />

            {filteredData.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Ningún producto confirmado coincide con el filtro.</p>
            ) : (
                <>
                    <p className="px-3 pt-3 text-sm font-medium">Listado:</p>
                    {paginatedData.map((item) => (
                        <BoughtItemRow key={item.id} item={item} units={units} places={places} containers={containers} />
                    ))}
                    {paginationLinks.length > 0 && <Pagination links={paginationLinks} onPageChange={handlePageChange} />}
                </>
            )}
        </div>
    );
}

export default function CheckoutIndex({ items, boughtItems, places, units, products, categories, productContainers }: CheckoutProps) {
    const [placeId, setPlaceId] = useState('');
    // Abre el modal automáticamente en la primera carga si aún no hay lugar elegido.
    const [changePlaceOpen, setChangePlaceOpen] = useState(() => !placeId);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tab, setTab] = useState<CheckoutTab>('pending');

    const placeItems: ComboboxItem[] = places.map((p) => ({ value: p.id!.toString(), label: p.name }));
    const selectedPlace = places.find((p) => p.id!.toString() === placeId);
    const [changePlaceContentEl, setChangePlaceContentEl] = useState<HTMLDivElement | null>(null);

    const { categoryFilter, setCategoryFilter, filteredItems: categoryFilteredItems } = useCategoryFilter(items, itemCategoryId);

    const {
        paginatedData: pendingPage,
        filteredData: pendingFiltered,
        paginationLinks: pendingLinks,
        handlePageChange: handlePendingPageChange,
    } = useClientPagination({
        data: categoryFilteredItems,
        itemsPerPage: ITEMS_PER_PAGE,
        searchTerm,
        sortKey: itemProductName,
        searchText: itemProductName,
    });

    const pendingCount = useMemo(() => countMatching(items, searchTerm), [items, searchTerm]);
    const confirmedCount = useMemo(() => countMatching(boughtItems, searchTerm), [boughtItems, searchTerm]);

    const tabs: { id: CheckoutTab; label: string; count: number }[] = [
        { id: 'pending', label: 'Productos en lista', count: pendingCount },
        { id: 'confirmed', label: 'Productos confirmados', count: confirmedCount },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar compra" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Registrar compra</h1>
                        {selectedPlace ? (
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                Comprando en
                                <ColorBadge text={selectedPlace.name} bgColor={selectedPlace.bg_color} textColor={selectedPlace.text_color} />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Elige un lugar para poder confirmar productos.</p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setAddProductOpen(true)} disabled={!placeId}>
                            Fuera de la lista
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setChangePlaceOpen(true)}>
                            {selectedPlace ? 'Cambiar lugar' : 'Elegir lugar'}
                        </Button>
                    </div>
                </div>

                {(items.length > 0 || boughtItems.length > 0) && (
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar productos..." />
                )}

                <div className="flex flex-col gap-0">
                    <div role="tablist" aria-label="Productos de la compra" className="flex flex-wrap gap-1 border-b">
                        {tabs.map(({ id, label, count }) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={tab === id}
                                onClick={() => setTab(id)}
                                className={cn(
                                    '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                    tab === id
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground',
                                )}
                            >
                                {label} ({count})
                            </button>
                        ))}
                    </div>

                    <div
                        role="tabpanel"
                        className={cn(
                            'relative flex flex-col overflow-x-auto rounded-b-xl border border-t-0 border-sidebar-border/70 dark:border-sidebar-border',
                            tab !== 'pending' && 'hidden',
                        )}
                    >
                        <div className="p-3 pb-0">
                            <CategoryFilterSelect categories={categories} value={categoryFilter} onValueChange={setCategoryFilter} />
                        </div>

                        {items.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">No tienes productos presupuestados pendientes por confirmar.</p>
                        ) : pendingFiltered.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">Ningún producto coincide con el filtro.</p>
                        ) : (
                            <>
                                {pendingPage.map((item) => (
                                    <CheckoutItemRow key={item.id} item={item} units={units} placeId={placeId} />
                                ))}
                                {pendingLinks.length > 0 && <Pagination links={pendingLinks} onPageChange={handlePendingPageChange} />}
                            </>
                        )}
                    </div>

                    <div
                        role="tabpanel"
                        className={cn(
                            'relative flex flex-col overflow-x-auto rounded-b-xl border border-t-0 border-sidebar-border/70 dark:border-sidebar-border',
                            tab !== 'confirmed' && 'hidden',
                        )}
                    >
                        <BoughtItemsList
                            boughtItems={boughtItems}
                            units={units}
                            places={places}
                            categories={categories}
                            containers={productContainers}
                            searchTerm={searchTerm}
                        />
                    </div>
                </div>
            </div>

            <Dialog open={changePlaceOpen} onOpenChange={setChangePlaceOpen}>
                <DialogContent className="overflow-visible sm:max-w-md" ref={setChangePlaceContentEl}>
                    <DialogHeader>
                        <DialogTitle>{selectedPlace ? 'Cambiar lugar de compra' : '¿Dónde compraste?'}</DialogTitle>
                        <DialogDescription>Los productos que confirmes se registrarán en este lugar.</DialogDescription>
                    </DialogHeader>
                    <Combobox
                        items={placeItems}
                        value={placeId}
                        onValueChange={(value) => {
                            setPlaceId(value);
                            setChangePlaceOpen(false);
                        }}
                        placeholder="Selecciona un lugar"
                        searchPlaceholder="Buscar lugar..."
                        emptyText="No se encontraron lugares"
                        portalContainer={changePlaceContentEl}
                    />
                </DialogContent>
            </Dialog>

            <AddOutOfListProductModal open={addProductOpen} onOpenChange={setAddProductOpen} products={products} units={units} placeId={placeId} />
        </AppLayout>
    );
}
