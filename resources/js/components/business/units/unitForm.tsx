import { Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { Unit } from '@/types/business/unit';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

type UnitFormData = {
    name: string;
    short_name: string;
    enabled: boolean | null;
    _method: 'POST' | 'PUT';
};

interface UnitFormProps {
    unit?: Unit;
    isEdit?: boolean;
}

export default function UnitForm({ unit, isEdit }: UnitFormProps) {
    const initialValues: Required<UnitFormData> = {
        name: unit?.name || '',
        short_name: unit?.short_name || '',
        enabled: isEdit ? (unit?.enabled ?? true) : true,
        _method: isEdit ? 'PUT' : 'POST',
    };

    const { data, setData, post, processing, reset, errors } = useForm<Required<UnitFormData>>(initialValues);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && unit?.id) {
            post(route('units.update', unit.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('units.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="grid gap-0 sm:grid-cols-2 sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight xl:text-4xl">{isEdit ? 'Actualizar' : 'Crear'} Unidad</h1>

                    <Button asChild size={'sm'} title="Volver a Unidades">
                        <Link href={route('units.index')} className="text-muted-foreground hover:text-foreground sm:hidden">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-self-end">
                    <Button variant="ghost" size="sm" className="hidden px-2 text-sm text-muted-foreground hover:text-foreground sm:flex" asChild>
                        <Link href={route('units.index')}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Unidades
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent>
                    <form onSubmit={submit} className="mx-auto flex w-full flex-col gap-4 sm:w-3/5" autoComplete="off">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    maxLength={50}
                                    autoFocus
                                    autoComplete="off"
                                    tabIndex={1}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Unidad"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="short_name">Nombre Corto</Label>
                                <Input
                                    id="short_name"
                                    type="text"
                                    required
                                    maxLength={5}
                                    autoComplete="off"
                                    tabIndex={2}
                                    value={data.short_name}
                                    onChange={(e) => setData('short_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Und"
                                />

                                <InputError message={errors.short_name} className="mt-1" />
                            </div>

                            <div className="grid justify-start gap-2">
                                <Label htmlFor="enabled">Estado</Label>
                                <Switch
                                    id="enabled"
                                    tabIndex={3}
                                    checked={!!data.enabled}
                                    onCheckedChange={(value) => setData('enabled', value)}
                                    disabled={processing}
                                />
                                <Label htmlFor="enabled">{!data.enabled ? 'Desactivado' : 'Activado'}</Label>
                            </div>

                            <Button type="submit" className="mx-auto mt-4 w-fit cursor-pointer" tabIndex={4}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? (isEdit ? 'Actualizando ' : 'Creando ') : isEdit ? 'Actualizar' : 'Crear'} Unidad
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
