import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { QuantityInput } from '@/components/shared/quantityInput.component';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { normalizeDecimal } from '@/lib/utils';
import { EquivalenceOption, ProductContainer } from '@/types/business/equivalence';

interface ProductContainerModalProps {
    container: ProductContainer | null;
    products: EquivalenceOption[];
    places: EquivalenceOption[];
    units: EquivalenceOption[];
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

const emptyForm: FormData = { product_id: '', place_id: '', container_unit_id: '', content_quantity: '', content_unit_id: '' };

export function ProductContainerModal({ container, products, places, units, open, onOpenChange }: ProductContainerModalProps) {
    const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm<FormData>(emptyForm);

    useEffect(() => {
        clearErrors();
        setData(
            container
                ? {
                      product_id: container.product_id.toString(),
                      place_id: container.place_id?.toString() ?? '',
                      container_unit_id: container.container_unit_id.toString(),
                      content_quantity: container.content_quantity.toString(),
                      content_unit_id: container.content_unit_id.toString(),
                  }
                : emptyForm,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container, open]);

    const toItems = (options: EquivalenceOption[]): ComboboxItem[] =>
        options.map((option) => ({ value: option.id.toString(), label: option.name, searchText: option.name }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((formData) => ({ ...formData, content_quantity: normalizeDecimal(formData.content_quantity) }));

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        };

        if (container) {
            put(route('product-containers.update', container.id), options);
        } else {
            post(route('product-containers.store'), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-visible sm:max-w-md" ref={setContentEl}>
                <DialogHeader>
                    <DialogTitle>{container ? 'Editar contenedor' : 'Nuevo contenedor'}</DialogTitle>
                    <DialogDescription>Cuánto trae un empaque de un producto. Ej: 1 Paquete de Leche en Mercado A = 6 Unidad.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label>Producto</Label>
                        <Combobox
                            items={toItems(products)}
                            value={data.product_id}
                            onValueChange={(value) => setData('product_id', value)}
                            placeholder="Selecciona un producto"
                            searchPlaceholder="Buscar producto..."
                            emptyText="No se encontraron productos"
                            portalContainer={contentEl}
                        />
                        <InputError message={errors.product_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Lugar</Label>
                        <Combobox
                            items={[{ value: '', label: 'Cualquier lugar' }, ...toItems(places)]}
                            value={data.place_id}
                            onValueChange={(value) => setData('place_id', value)}
                            placeholder="Cualquier lugar"
                            searchPlaceholder="Buscar lugar..."
                            emptyText="No se encontraron lugares"
                            portalContainer={contentEl}
                        />
                        <p className="text-xs text-muted-foreground">Déjalo en "Cualquier lugar" para que aplique donde no haya una regla propia.</p>
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
                            placeholder="Unidad, Mililitro..."
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
