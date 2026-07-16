import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';
import { LoaderCircle } from 'lucide-react';

interface ProductDespensaModalProps {
    product: Product | null;
    units: Unit[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type DespensaForm = {
    will_buy: boolean;
    quantity_planned: string;
    unit_id_planned: string;
    has_at_home: boolean;
    quantity_at_home: string;
    unit_id_at_home: string;
};

export function ProductDespensaModal({ product, units, open, onOpenChange }: ProductDespensaModalProps) {
    const { data, setData, put, processing, reset, transform } = useForm<DespensaForm>({
        will_buy: false,
        quantity_planned: '',
        unit_id_planned: '',
        has_at_home: false,
        quantity_at_home: '',
        unit_id_at_home: '',
    });

    useEffect(() => {
        if (!product) return;

        setData({
            will_buy: !!product.active_checklist_item_id,
            quantity_planned: product.active_quantity_planned?.toString() || '',
            unit_id_planned: product.active_unit_id_planned?.toString() || '',
            has_at_home: product.active_quantity_at_home != null,
            quantity_at_home: product.active_quantity_at_home?.toString() || '',
            unit_id_at_home: product.active_unit_id_at_home?.toString() || '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    const unitItems: ComboboxItem[] = units.map((u) => ({ value: u.id.toString(), label: u.short_name, searchText: `${u.name} ${u.short_name}` }));

    if (!product) return null;

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((formData) => ({
            will_buy: formData.will_buy,
            quantity_planned: formData.will_buy && formData.quantity_planned ? formData.quantity_planned : null,
            unit_id_planned: formData.will_buy && formData.unit_id_planned ? formData.unit_id_planned : null,
            quantity_at_home: formData.has_at_home && formData.quantity_at_home ? formData.quantity_at_home : null,
            unit_id_at_home: formData.has_at_home && formData.unit_id_at_home ? formData.unit_id_at_home : null,
        }));

        put(route('despensy.products.update', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">{product.name}</DialogTitle>
                    {product.category && (
                        <DialogDescription asChild>
                            <div>
                                <ColorBadge
                                    text={product.category.name}
                                    icon={product.category.icon}
                                    bgColor={product.category.bg_color}
                                    textColor={product.category.text_color}
                                />
                            </div>
                        </DialogDescription>
                    )}
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                        <div>
                            <p className="text-muted-foreground">Última compra</p>
                            <p className="font-semibold">
                                {product.last_price ? `$${product.last_price}` : 'Sin compras'}
                                {product.last_place_name && ` · ${product.last_place_name}`}
                            </p>
                            {product.last_purchase_date && <p className="text-xs text-muted-foreground">{product.last_purchase_date}</p>}
                        </div>
                        <Button type="button" variant="outline" size="sm" disabled title="Próximamente">
                            Histórico
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3 rounded-md border p-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="has_at_home"
                                checked={data.has_at_home}
                                onCheckedChange={(value) => setData('has_at_home', value === true)}
                            />
                            <Label htmlFor="has_at_home">¿Hay en la casa?</Label>
                        </div>

                        {data.has_at_home && (
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="Cantidad"
                                    className="w-28"
                                    value={data.quantity_at_home}
                                    onChange={(e) => setData('quantity_at_home', e.target.value)}
                                />
                                <Combobox
                                    items={unitItems}
                                    value={data.unit_id_at_home}
                                    onValueChange={(value) => setData('unit_id_at_home', value)}
                                    placeholder="Unidad"
                                    searchPlaceholder="Buscar unidad..."
                                    emptyText="No se encontraron unidades"
                                    className="flex-1"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 rounded-md border p-3">
                        <div className="flex items-center gap-2">
                            <Checkbox id="will_buy" checked={data.will_buy} onCheckedChange={(value) => setData('will_buy', value === true)} />
                            <Label htmlFor="will_buy">¿Se va a comprar?</Label>
                        </div>

                        {data.will_buy && (
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="Cantidad"
                                    className="w-28"
                                    value={data.quantity_planned}
                                    onChange={(e) => setData('quantity_planned', e.target.value)}
                                />
                                <Combobox
                                    items={unitItems}
                                    value={data.unit_id_planned}
                                    onValueChange={(value) => setData('unit_id_planned', value)}
                                    placeholder="Unidad"
                                    searchPlaceholder="Buscar unidad..."
                                    emptyText="No se encontraron unidades"
                                    className="flex-1"
                                />
                            </div>
                        )}
                    </div>

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
