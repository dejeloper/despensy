import { useForm } from '@inertiajs/react';
import { Check, LoaderCircle, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Pagination } from '@/components/shared/pagination.component';
import { QuantityInput } from '@/components/shared/quantityInput.component';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { useClientPagination } from '@/hooks/use-client-pagination';
import { cn, formatQuantity, normalizeDecimal } from '@/lib/utils';
import { EquivalenceOption, ProductContainer } from '@/types/business/equivalence';
import { Place } from '@/types/business/place';
import { Unit } from '@/types/business/unit';

const CONTAINERS_PER_PAGE = 5;

interface ConversionSetupModalProps {
    productId: number;
    productName: string;
    defaultContainerUnitId?: number;
    containers: ProductContainer[];
    units: Unit[];
    places: Place[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type FormData = {
    product_id: string;
    place_id: string;
    container_unit_id: string;
    content_quantity: string;
    content_unit_id: string;
};

export function ConversionSetupModal({
    productId,
    productName,
    defaultContainerUnitId,
    containers,
    units,
    places,
    open,
    onOpenChange,
}: ConversionSetupModalProps) {
    const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const emptyForm: FormData = useMemo(
        () => ({
            product_id: productId.toString(),
            place_id: '',
            container_unit_id: defaultContainerUnitId?.toString() ?? '',
            content_quantity: '',
            content_unit_id: '',
        }),
        [productId, defaultContainerUnitId],
    );

    const { data, setData, post, put, processing, errors, clearErrors, transform } = useForm<FormData>(emptyForm);

    useEffect(() => {
        if (!open) return;
        clearErrors();
        setEditingId(null);
        setData(emptyForm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, emptyForm]);

    const productContainers = useMemo(() => containers.filter((container) => container.product_id === productId), [containers, productId]);

    const { paginatedData, paginationLinks, handlePageChange } = useClientPagination({
        data: productContainers,
        itemsPerPage: CONTAINERS_PER_PAGE,
        searchTerm: '',
        sortKey: 'id',
        sortDirection: 'desc',
    });

    const toItems = (options: EquivalenceOption[]): ComboboxItem[] =>
        options.map((option) => ({ value: option.id.toString(), label: option.name, searchText: option.name }));

    const select = (container: ProductContainer) => {
        clearErrors();
        setEditingId(container.id);
        setData({
            product_id: productId.toString(),
            place_id: container.place_id?.toString() ?? '',
            container_unit_id: container.container_unit_id.toString(),
            content_quantity: container.content_quantity.toString(),
            content_unit_id: container.content_unit_id.toString(),
        });
    };

    const startNew = () => {
        clearErrors();
        setEditingId(null);
        setData(emptyForm);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((formData) => ({ ...formData, content_quantity: normalizeDecimal(formData.content_quantity) }));

        const options = { preserveScroll: true, onSuccess: () => onOpenChange(false) };

        if (editingId) {
            put(route('product-containers.update', editingId), options);
        } else {
            post(route('product-containers.store'), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-visible sm:max-w-lg" ref={setContentEl}>
                <DialogHeader>
                    <DialogTitle>Equivalencias de {productName}</DialogTitle>
                    <DialogDescription>
                        Define cuánto trae un empaque para poder calcular el precio por unidad mínima. Sin esto no hay con qué convertir.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Configuradas ({productContainers.length})</p>
                        <Button type="button" variant="outline" size="sm" onClick={startNew} disabled={editingId === null}>
                            <Plus className="mr-1 h-4 w-4" /> Nueva
                        </Button>
                    </div>

                    <div className="flex flex-col rounded-md border">
                        {productContainers.length === 0 ? (
                            <p className="p-3 text-sm text-muted-foreground">Este producto todavía no tiene equivalencias.</p>
                        ) : (
                            paginatedData.map((container) => (
                                <button
                                    key={container.id}
                                    type="button"
                                    onClick={() => select(container)}
                                    className={cn(
                                        'flex items-center justify-between gap-2 border-b p-2 text-left text-sm transition-colors last:border-b-0 hover:bg-muted/50',
                                        editingId === container.id && 'bg-muted',
                                    )}
                                >
                                    <span>
                                        <span className="font-medium">1 {container.container_unit_name}</span>{' '}
                                        <span className="text-muted-foreground">en {container.place_name ?? 'cualquier lugar'}</span> ={' '}
                                        {formatQuantity(container.content_quantity)} {container.content_unit_name}
                                    </span>
                                    {editingId === container.id && <Check className="h-4 w-4 shrink-0" />}
                                </button>
                            ))
                        )}
                    </div>

                    {paginationLinks.length > 0 && <Pagination links={paginationLinks} onPageChange={handlePageChange} />}
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4 border-t pt-4">
                    <p className="text-sm font-medium">{editingId ? 'Editar equivalencia' : 'Nueva equivalencia'}</p>

                    <div className="grid gap-2">
                        <Label>Lugar</Label>
                        <Combobox
                            items={[{ value: '', label: 'Cualquier lugar' }, ...toItems(places as EquivalenceOption[])]}
                            value={data.place_id}
                            onValueChange={(value) => setData('place_id', value)}
                            placeholder="Cualquier lugar"
                            searchPlaceholder="Buscar lugar..."
                            emptyText="No se encontraron lugares"
                            portalContainer={contentEl}
                        />
                        <InputError message={errors.place_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Contenedor</Label>
                        <Combobox
                            items={toItems(units)}
                            value={data.container_unit_id}
                            onValueChange={(value) => setData('container_unit_id', value)}
                            placeholder="Paquete, Caja, Bolsa..."
                            searchPlaceholder="Buscar unidad..."
                            emptyText="No se encontraron unidades"
                            portalContainer={contentEl}
                        />
                        <InputError message={errors.container_unit_id} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-end">
                        <div className="grid gap-2">
                            <Label htmlFor="content_quantity">Contiene</Label>
                            <QuantityInput
                                id="content_quantity"
                                className="sm:w-28"
                                placeholder="6"
                                decimals={4}
                                value={data.content_quantity}
                                onChange={(value) => setData('content_quantity', value)}
                            />
                        </div>
                        <Combobox
                            items={toItems(units)}
                            value={data.content_unit_id}
                            onValueChange={(value) => setData('content_unit_id', value)}
                            placeholder="Unidad, Gramo, Mililitro..."
                            searchPlaceholder="Buscar unidad..."
                            emptyText="No se encontraron unidades"
                            portalContainer={contentEl}
                        />
                    </div>
                    <InputError message={errors.content_quantity ?? errors.content_unit_id} />

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
