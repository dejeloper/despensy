import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { Checklist, ChecklistItem } from '@/types/business/checklist';
import { Place } from '@/types/business/place';
import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Listas de compra', href: route('checklists.index') },
    { title: 'Lista activa', href: '#' },
];

interface ChecklistActiveProps {
    checklist: Checklist | null;
    products: Product[];
    units: Unit[];
    places: Place[];
}

function AddProductForm({ checklistId, products }: { checklistId: number; products: Product[] }) {
    const { data, setData, post, processing, reset } = useForm({ product_id: '', quantity_planned: '' });

    const productItems: ComboboxItem[] = products.map((p) => ({ value: p.id.toString(), label: p.name }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.product_id) return;
        post(route('checklist-items.store', checklistId), { onSuccess: () => reset() });
    };

    return (
        <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
            <Combobox
                items={productItems}
                value={data.product_id}
                onValueChange={(value) => setData('product_id', value)}
                placeholder="Selecciona un producto"
                searchPlaceholder="Buscar producto..."
                emptyText="No se encontraron productos"
                className="w-64"
            />
            <Input
                type="number"
                min={1}
                placeholder="Cantidad"
                className="w-28"
                value={data.quantity_planned}
                onChange={(e) => setData('quantity_planned', e.target.value)}
            />
            <Button type="submit" size="sm" disabled={processing}>
                Agregar
            </Button>
        </form>
    );
}

function MarkBoughtForm({ item, units, places }: { item: ChecklistItem; units: Unit[]; places: Place[] }) {
    const { data, setData, patch, processing } = useForm({
        quantity_bought: item.quantity_planned?.toString() || '1',
        unit_id_bought: '',
        place_id: '',
        unit_price: '',
    });

    const unitItems: ComboboxItem[] = units.map((u) => ({ value: u.id.toString(), label: u.short_name }));
    const placeItems: ComboboxItem[] = places.map((p) => ({ value: p.id!.toString(), label: p.name }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.unit_id_bought || !data.place_id) return;
        patch(route('checklist-items.mark-bought', item.id));
    };

    return (
        <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
            <Input
                type="number"
                min={1}
                className="w-20"
                placeholder="Cant."
                value={data.quantity_bought}
                onChange={(e) => setData('quantity_bought', e.target.value)}
                required
            />
            <Combobox
                items={unitItems}
                value={data.unit_id_bought}
                onValueChange={(value) => setData('unit_id_bought', value)}
                placeholder="Unidad"
                searchPlaceholder="Buscar unidad..."
                emptyText="No se encontraron unidades"
                className="w-32"
            />
            <Combobox
                items={placeItems}
                value={data.place_id}
                onValueChange={(value) => setData('place_id', value)}
                placeholder="Lugar"
                searchPlaceholder="Buscar lugar..."
                emptyText="No se encontraron lugares"
                className="w-40"
            />
            <Input
                type="number"
                min={0}
                step="0.01"
                className="w-28"
                placeholder="Precio"
                value={data.unit_price}
                onChange={(e) => setData('unit_price', e.target.value)}
                required
            />
            <Button type="submit" size="sm" disabled={processing}>
                Marcar comprado
            </Button>
        </form>
    );
}

export default function ChecklistActive({ checklist, products, units, places }: ChecklistActiveProps) {
    if (!checklist) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Lista activa" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
                    <p className="text-muted-foreground">No tienes una lista de compra activa.</p>
                    <Link href={route('checklists.index')}>
                        <Button>Ir a listas de compra</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lista activa" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{checklist.name || `Lista #${checklist.id}`}</h1>
                        <Badge style={{ backgroundColor: checklist.state?.color || undefined }}>{checklist.state?.name}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.post(route('checklists.complete', checklist.id))}>
                            Completar
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

                <Card>
                    <CardContent>
                        <AddProductForm checklistId={checklist.id} products={products} />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-2">
                    {(checklist.items?.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">Todavía no hay productos en la lista.</p>}
                    {checklist.items?.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{item.product?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Planeado: {item.quantity_planned ?? '—'} {item.unit_planned?.short_name || ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.was_bought ? (
                                            <>
                                                <Badge variant="secondary">
                                                    Comprado: {item.quantity_bought} {item.unit_bought?.short_name} en {item.place?.name} · $
                                                    {item.unit_price}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.patch(route('checklist-items.mark-not-bought', item.id))}
                                                >
                                                    Deshacer
                                                </Button>
                                            </>
                                        ) : null}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('¿Quitar este producto de la lista?')) {
                                                    router.delete(route('checklist-items.destroy', [checklist.id, item.id]));
                                                }
                                            }}
                                        >
                                            Quitar
                                        </Button>
                                    </div>
                                </div>
                                {!item.was_bought && <MarkBoughtForm item={item} units={units} places={places} />}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
