import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';
import { ChecklistItem } from '@/types/business/checklist';
import { Place } from '@/types/business/place';
import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';

import { AddOutOfListProductModal } from '@/components/business/checkout/addOutOfListProductModal';
import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Money } from '@/components/shared/money.component';
import { SearchBar } from '@/components/shared/searchbar.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Despensa', href: route('despensy.index') },
    { title: 'Registrar compra', href: '#' },
];

interface CheckoutProps {
    checklist: { id: number; name: string | null };
    items: ChecklistItem[];
    boughtItems: ChecklistItem[];
    places: Place[];
    units: Unit[];
    products: Product[];
    categories: Category[];
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
        transform((formData) => ({ ...formData, place_id: placeId }));
        // La redirección de vuelta refresca las props (incluyendo `items` y
        // `boughtItems`). `preserveState` mantiene el `placeId` local elegido para
        // no volver a la pantalla de "¿Dónde compraste?" tras confirmar.
        patch(route('checklist-items.mark-bought', item.id), { preserveScroll: true, preserveState: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-3 border-b p-4 last:border-b-0 sm:flex-row sm:flex-wrap sm:items-start sm:gap-2 sm:p-3">
            <div className="flex w-full items-center justify-between gap-2 sm:min-w-[140px] sm:flex-1">
                <p className="min-w-0 truncate text-base font-semibold">{item.product?.name}</p>
                {item.product?.category && (
                    <ColorBadge
                        text={item.product.category.name}
                        icon={item.product.category.icon}
                        bgColor={item.product.category.bg_color}
                        textColor={item.product.category.text_color}
                        className="min-w-0 shrink-0 px-2 py-0.5 text-sm font-medium"
                    />
                )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:contents">
                <div className="sm:w-24">
                    <Input
                        type="number"
                        min={1}
                        placeholder="Cantidad"
                        value={data.quantity_bought}
                        onChange={(e) => setData('quantity_bought', e.target.value)}
                        required
                    />
                    {errors.quantity_bought && <p className="mt-1 text-xs text-destructive">{errors.quantity_bought}</p>}
                </div>
                <div className="sm:w-32">
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
            </div>
            <div className="w-full sm:w-28">
                <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Precio total"
                    value={data.total_price}
                    onChange={(e) => setData('total_price', e.target.value)}
                    required
                />
                {errors.total_price && <p className="mt-1 text-xs text-destructive">{errors.total_price}</p>}
            </div>
            <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto"
                disabled={processing || !placeId || !data.quantity_bought || !data.unit_id_bought || !data.total_price}
            >
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Confirmar
            </Button>
        </form>
    );
}

function BoughtItemsList({ boughtItems }: { boughtItems: ChecklistItem[] }) {
    if (boughtItems.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardContent className="flex flex-col gap-2 p-0">
                <p className="p-3 pb-0 font-medium">Comprados ({boughtItems.length})</p>
                {boughtItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col gap-1 border-b p-4 last:border-b-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:p-3"
                    >
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                            <p className="min-w-0 truncate text-base font-semibold">{item.product?.name}</p>
                            {item.product?.category && (
                                <ColorBadge
                                    text={item.product.category.name}
                                    icon={item.product.category.icon}
                                    bgColor={item.product.category.bg_color}
                                    textColor={item.product.category.text_color}
                                    className="min-w-0 shrink-0 px-2 py-0.5 text-sm font-medium"
                                />
                            )}
                        </div>
                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                            <p className="text-sm text-muted-foreground">
                                {item.quantity_bought} {item.unit_bought?.short_name}
                            </p>
                            <Money value={item.total_price} />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function CheckoutIndex({ items, boughtItems, places, units, products, categories }: CheckoutProps) {
    const [placeId, setPlaceId] = useState('');
    // Abre el modal automáticamente en la primera carga si aún no hay lugar elegido.
    const [changePlaceOpen, setChangePlaceOpen] = useState(() => !placeId);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const placeItems: ComboboxItem[] = places.map((p) => ({ value: p.id!.toString(), label: p.name }));
    const selectedPlace = places.find((p) => p.id!.toString() === placeId);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (categoryFilter !== 'all' && item.product?.category?.id?.toString() !== categoryFilter) return false;
            if (searchTerm && !item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [items, searchTerm, categoryFilter]);

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

                {items.length > 0 && (
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
                    </div>
                )}

                <Card>
                    <CardContent className="flex flex-col p-0">
                        {items.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">No tienes productos presupuestados pendientes por confirmar.</p>
                        ) : filteredItems.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">Ningún producto coincide con el filtro.</p>
                        ) : (
                            filteredItems.map((item) => <CheckoutItemRow key={item.id} item={item} units={units} placeId={placeId} />)
                        )}
                    </CardContent>
                </Card>

                <BoughtItemsList boughtItems={boughtItems} />
            </div>

            <Dialog open={changePlaceOpen} onOpenChange={setChangePlaceOpen}>
                <DialogContent className="sm:max-w-md">
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
                    />
                </DialogContent>
            </Dialog>

            <AddOutOfListProductModal open={addProductOpen} onOpenChange={setAddProductOpen} products={products} units={units} placeId={placeId} />
        </AppLayout>
    );
}
