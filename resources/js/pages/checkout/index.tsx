import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { BreadcrumbItem } from '@/types';
import { ChecklistItem } from '@/types/business/checklist';
import { Place } from '@/types/business/place';
import { Unit } from '@/types/business/unit';

import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Money } from '@/components/shared/money.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
}

function CheckoutItemRow({ item, units, placeId }: { item: ChecklistItem; units: Unit[]; placeId: string }) {
    const { data, setData, patch, transform, processing, errors } = useForm({
        quantity_bought: item.quantity_planned?.toString() || '1',
        unit_id_bought: item.unit_planned?.id?.toString() || '',
        unit_price: '',
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
        <form onSubmit={submit} className="flex flex-wrap items-start gap-2 border-b p-3 last:border-b-0">
            <div className="min-w-[140px] flex-1">
                <p className="font-medium">{item.product?.name}</p>
                {item.product?.category && (
                    <ColorBadge
                        text={item.product.category.name}
                        icon={item.product.category.icon}
                        bgColor={item.product.category.bg_color}
                        textColor={item.product.category.text_color}
                        className="mt-1"
                    />
                )}
            </div>
            <div className="w-24">
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
            <div className="w-32">
                <Combobox
                    items={unitItems}
                    value={data.unit_id_bought}
                    onValueChange={(value) => setData('unit_id_bought', value)}
                    placeholder="Unidad"
                    searchPlaceholder="Buscar unidad..."
                    emptyText="No se encontraron unidades"
                />
                {errors.unit_id_bought && <p className="mt-1 text-xs text-destructive">{errors.unit_id_bought}</p>}
            </div>
            <div className="w-28">
                <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Precio"
                    value={data.unit_price}
                    onChange={(e) => setData('unit_price', e.target.value)}
                    required
                />
                {errors.unit_price && <p className="mt-1 text-xs text-destructive">{errors.unit_price}</p>}
            </div>
            <Button type="submit" size="sm" disabled={processing || !placeId || !data.quantity_bought || !data.unit_id_bought || !data.unit_price}>
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
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-b p-3 last:border-b-0">
                        <div className="min-w-[140px] flex-1">
                            <p className="font-medium">{item.product?.name}</p>
                            {item.product?.category && (
                                <ColorBadge
                                    text={item.product.category.name}
                                    icon={item.product.category.icon}
                                    bgColor={item.product.category.bg_color}
                                    textColor={item.product.category.text_color}
                                    className="mt-1"
                                />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {item.quantity_bought} {item.unit_bought?.short_name}
                        </p>
                        <Money value={item.total_price} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function CheckoutIndex({ items, boughtItems, places, units }: CheckoutProps) {
    const [placeId, setPlaceId] = useState('');
    // Abre el modal automáticamente en la primera carga si aún no hay lugar elegido.
    const [changePlaceOpen, setChangePlaceOpen] = useState(() => !placeId);

    const placeItems: ComboboxItem[] = places.map((p) => ({ value: p.id!.toString(), label: p.name }));
    const selectedPlace = places.find((p) => p.id!.toString() === placeId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar compra" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Registrar compra</h1>
                        <p className="text-sm text-muted-foreground">
                            {selectedPlace ? (
                                <>
                                    Comprando en <span className="font-medium text-foreground">{selectedPlace.name}</span>
                                </>
                            ) : (
                                'Elige un lugar para poder confirmar productos.'
                            )}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setChangePlaceOpen(true)}>
                        {selectedPlace ? 'Cambiar lugar' : 'Elegir lugar'}
                    </Button>
                </div>

                <Card>
                    <CardContent className="flex flex-col p-0">
                        {items.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">No tienes productos presupuestados pendientes por confirmar.</p>
                        ) : (
                            items.map((item) => <CheckoutItemRow key={item.id} item={item} units={units} placeId={placeId} />)
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
        </AppLayout>
    );
}
