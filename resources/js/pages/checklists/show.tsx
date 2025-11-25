import { Loading } from '@/components/shared/loading.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Checklist, ChecklistDetail } from '@/types/business/checklist';
import { Place } from '@/types/business/place';
import { Head, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Checklists',
        href: '/dashboard/checklists',
    },
    {
        title: 'Ver',
        href: '#',
    },
];

interface ProcessItemFormData {
    quantity_bought: number;
    price_paid: number;
    place_id: number;
    fecha_compra: string;
    [key: string]: number | string;
}

export default function ChecklistShow({ checklist, places }: { checklist: Checklist; places: Place[] }) {
    const [processingItem, setProcessingItem] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const [data, setDataState] = useState<ProcessItemFormData>({
        quantity_bought: 0,
        price_paid: 0,
        place_id: places[0]?.id || 0,
        fecha_compra: '',
    });

    const setData = (field: keyof ProcessItemFormData, value: number | string) => {
        setDataState((prev) => ({ ...prev, [field]: value }));
    };

    const reset = () => {
        setDataState({
            quantity_bought: 0,
            price_paid: 0,
            place_id: places[0]?.id || 0,
            fecha_compra: '',
        });
    };

    const startProcessing = (detail: ChecklistDetail) => {
        setProcessingItem(detail.id);
        setDataState({
            quantity_bought: detail.quantity_planned || 1,
            price_paid: detail.product?.price || 0,
            place_id: detail.product?.place_id || places[0]?.id || 0,
            fecha_compra: '',
        });
    };

    const submitProcess = (e: React.FormEvent, detailId: number) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('checklists.items.update', { checklist: checklist.id, item: detailId }), data, {
            onSuccess: () => {
                reset();
                setProcessingItem(null);
                setProcessing(false);
                router.reload();
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Checklist #${checklist.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Checklist #{checklist.id}</h1>
                    <Badge variant={checklist.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {checklist.status === 'ACTIVE' ? 'Activo' : 'Completado'}
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Productos del Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Stock Reportado</TableHead>
                                        <TableHead>¿Comprar?</TableHead>
                                        <TableHead>Cant. Planificada</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {checklist.details?.map((detail) => (
                                        <TableRow key={detail.id}>
                                            <TableCell>{detail.product?.name}</TableCell>
                                            <TableCell>{detail.reported_stock ?? '-'}</TableCell>
                                            <TableCell>{detail.to_buy ? 'Sí' : 'No'}</TableCell>
                                            <TableCell>{detail.quantity_planned ?? '-'}</TableCell>
                                            <TableCell>
                                                {detail.is_processed ? (
                                                    <Badge variant="secondary">
                                                        <Check className="mr-1 h-3 w-3" /> Procesado
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">Pendiente</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {!detail.is_processed && checklist.status === 'ACTIVE' && detail.to_buy && (
                                                    <Button size="sm" onClick={() => startProcessing(detail)} disabled={processingItem !== null}>
                                                        Procesar
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={processingItem !== null} onOpenChange={(open) => !open && setProcessingItem(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Procesar Compra</DialogTitle>
                            <DialogDescription>Ingresa los detalles de la compra realizada</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => submitProcess(e, processingItem!)} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity_bought">Cantidad Comprada</Label>
                                <Input
                                    id="quantity_bought"
                                    type="number"
                                    min="1"
                                    required
                                    value={data.quantity_bought}
                                    onChange={(e) => setData('quantity_bought', Math.max(1, parseInt(e.target.value) || 1))}
                                    disabled={processing}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price_paid">Precio Pagado</Label>
                                <Input
                                    id="price_paid"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={data.price_paid}
                                    onChange={(e) => setData('price_paid', parseFloat(e.target.value) || 0)}
                                    disabled={processing}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fecha_compra">Fecha de Compra</Label>
                                <Input
                                    id="fecha_compra"
                                    type="date"
                                    value={data.fecha_compra}
                                    onChange={(e) => setData('fecha_compra', e.target.value)}
                                    disabled={processing}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="place_id">Lugar de Compra</Label>
                                <Select
                                    value={data.place_id?.toString() ?? ''}
                                    onValueChange={(value) => setData('place_id', parseInt(value))}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="place_id">
                                        <SelectValue placeholder="Selecciona un lugar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {places.map((place) => (
                                            <SelectItem key={place.id} value={place.id!.toString()}>
                                                {place.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setProcessingItem(null)} disabled={processing}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? <Loading size="sm" text="Guardando..." /> : 'Guardar Compra'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
