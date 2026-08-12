import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { QuantityInput } from '@/components/shared/quantityInput.component';
import { normalizeDecimal, sortBy } from '@/lib/utils';
import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';

interface AddOutOfListProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: Product[];
    units: Unit[];
    placeId: string;
}

type AddProductForm = {
    product_id: string;
    quantity_bought: string;
    unit_id_bought: string;
    total_price: string;
};

export function AddOutOfListProductModal({ open, onOpenChange, products, units, placeId }: AddOutOfListProductModalProps) {
    // State (not useRef) so the DialogContent's mount triggers a re-render —
    // a ref alone stays null through the render that creates it.
    const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

    const { data, setData, post, processing, errors, reset, transform } = useForm<AddProductForm>({
        product_id: '',
        quantity_bought: '1',
        unit_id_bought: '',
        total_price: '',
    });

    const productItems: ComboboxItem[] = sortBy(products, 'name').map((p) => ({ value: p.id.toString(), label: p.name }));
    const unitItems: ComboboxItem[] = units.map((u) => ({ value: u.id.toString(), label: u.name, searchText: `${u.name} ${u.name}` }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        transform((formData) => ({ ...formData, quantity_bought: normalizeDecimal(formData.quantity_bought), place_id: placeId }));
        post(route('checkout.add-product'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
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
                    <DialogTitle>Producto fuera de la lista</DialogTitle>
                    <DialogDescription>Se agregará directamente como comprado, sin haber sido presupuestado.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-3">
                    <div>
                        <Combobox
                            items={productItems}
                            value={data.product_id}
                            onValueChange={(value) => setData('product_id', value)}
                            placeholder="Selecciona un producto"
                            searchPlaceholder="Buscar producto..."
                            emptyText="No se encontraron productos"
                            portalContainer={contentEl}
                        />
                        {errors.product_id && <p className="mt-1 text-xs text-destructive">{errors.product_id}</p>}
                    </div>

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
                                placeholder="Selecciona unidad"
                                searchPlaceholder="Buscar unidad..."
                                emptyText="No se encontraron unidades"
                                portalContainer={contentEl}
                            />
                            {errors.unit_id_bought && <p className="mt-1 text-xs text-destructive">{errors.unit_id_bought}</p>}
                        </div>
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
                        <Button
                            type="submit"
                            disabled={
                                processing || !placeId || !data.product_id || !data.quantity_bought || !data.unit_id_bought || !data.total_price
                            }
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
