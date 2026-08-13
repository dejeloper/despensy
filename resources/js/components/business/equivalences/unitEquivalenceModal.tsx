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
import { EquivalenceOption, UnitEquivalence } from '@/types/business/equivalence';

interface UnitEquivalenceModalProps {
    equivalence: UnitEquivalence | null;
    units: EquivalenceOption[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type FormData = {
    unit_id: string;
    parent_unit_id: string;
    factor: string;
};

const emptyForm: FormData = { unit_id: '', parent_unit_id: '', factor: '' };

export function UnitEquivalenceModal({ equivalence, units, open, onOpenChange }: UnitEquivalenceModalProps) {
    const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm<FormData>(emptyForm);

    useEffect(() => {
        clearErrors();
        setData(
            equivalence
                ? {
                      unit_id: equivalence.unit_id.toString(),
                      parent_unit_id: equivalence.parent_unit_id.toString(),
                      factor: equivalence.factor.toString(),
                  }
                : emptyForm,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equivalence, open]);

    const unitItems: ComboboxItem[] = units.map((unit) => ({
        value: unit.id.toString(),
        label: unit.short_name ? `${unit.name} (${unit.short_name})` : unit.name,
        searchText: `${unit.name} ${unit.short_name ?? ''}`,
    }));

    const unitName = units.find((u) => u.id.toString() === data.unit_id)?.name;
    const parentName = units.find((u) => u.id.toString() === data.parent_unit_id)?.name;

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((formData) => ({ ...formData, factor: normalizeDecimal(formData.factor) }));

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        };

        if (equivalence) {
            put(route('unit-equivalences.update', equivalence.id), options);
        } else {
            post(route('unit-equivalences.store'), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-visible sm:max-w-md" ref={setContentEl}>
                <DialogHeader>
                    <DialogTitle>{equivalence ? 'Editar equivalencia' : 'Nueva equivalencia'}</DialogTitle>
                    <DialogDescription>Aplica a todos los productos y lugares. Ej: 1 Kilogramo = 1000 Gramo.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label>Unidad</Label>
                        <Combobox
                            items={unitItems}
                            value={data.unit_id}
                            onValueChange={(value) => setData('unit_id', value)}
                            placeholder="Selecciona una unidad"
                            searchPlaceholder="Buscar unidad..."
                            emptyText="No se encontraron unidades"
                            portalContainer={contentEl}
                        />
                        <InputError message={errors.unit_id} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-end">
                        <div className="grid gap-2">
                            <Label htmlFor="factor">Equivale a</Label>
                            <QuantityInput
                                id="factor"
                                className="sm:w-28"
                                placeholder="1000"
                                decimals={4}
                                value={data.factor}
                                onChange={(value) => setData('factor', value)}
                            />
                        </div>
                        <Combobox
                            items={unitItems}
                            value={data.parent_unit_id}
                            onValueChange={(value) => setData('parent_unit_id', value)}
                            placeholder="Selecciona la unidad equivalente"
                            searchPlaceholder="Buscar unidad..."
                            emptyText="No se encontraron unidades"
                            portalContainer={contentEl}
                        />
                    </div>
                    <InputError message={errors.factor ?? errors.parent_unit_id} />

                    {unitName && parentName && data.factor && (
                        <p className="text-sm text-muted-foreground">
                            1 {unitName} = {data.factor} {parentName}
                        </p>
                    )}

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
