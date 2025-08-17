import { Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomTextarea } from '@/components/ui/customTextarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

type PlaceForm = {
    name: string;
    short_name: string;
    address: string;
    bg_color?: string;
    text_color?: string;
    note: string;
    enabled: boolean | null;
    _method: 'POST' | 'PUT';
};

export default function PlaceForm({ ...props }) {
    const { place, isView, isEdit } = props;

    const { data, setData, post, processing, reset, errors } = useForm<Required<PlaceForm>>({
        name: place?.name || '',
        short_name: place?.short_name || '',
        address: place?.address || '',
        bg_color: place?.bg_color || '#ffffff',
        text_color: place?.text_color || '#000000',
        note: place?.note || '',
        enabled: isEdit || isView ? place.enabled : true,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route('places.update', place.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('places.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="grid gap-0 sm:grid-cols-2 sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight xl:text-4xl">
                        {isView ? 'Ver' : isEdit ? 'Actualizar' : 'Crear'} Lugar
                    </h1>

                    <Button asChild size={'sm'} title="Volver a Lugares">
                        <Link href={route('places.index')} className="text-muted-foreground hover:text-foreground sm:hidden">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-self-end">
                    <Button variant="ghost" size="sm" className="hidden px-2 text-sm text-muted-foreground hover:text-foreground sm:flex" asChild>
                        <Link href={route('places.index')}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Lugares
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
                                    autoFocus
                                    autoComplete="off"
                                    tabIndex={1}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing || isView}
                                    placeholder={!isView ? 'Supermercado Ejemplo' : ''}
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="short_name">Nombre corto</Label>
                                <Input
                                    id="short_name"
                                    type="text"
                                    required
                                    autoComplete="off"
                                    tabIndex={1}
                                    value={data.short_name}
                                    onChange={(e) => setData('short_name', e.target.value)}
                                    disabled={processing || isView}
                                    placeholder={!isView ? 'Super 1' : ''}
                                />
                                <InputError message={errors.short_name} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    autoComplete="off"
                                    tabIndex={2}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    disabled={processing || isView}
                                    placeholder={!isView ? 'Calle Falsa 123' : ''}
                                />
                                <InputError message={errors.address} className="mt-1" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="bg_color">Background</Label>
                                    <Input
                                        id="bg_color"
                                        type="color"
                                        autoComplete="off"
                                        tabIndex={4}
                                        value={data.bg_color}
                                        onChange={(e) => setData('bg_color', e.target.value)}
                                        disabled={processing || isView}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="text_color">Texto</Label>
                                    <Input
                                        id="text_color"
                                        type="color"
                                        autoComplete="off"
                                        tabIndex={5}
                                        value={data.text_color}
                                        onChange={(e) => setData('text_color', e.target.value)}
                                        disabled={processing || isView}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="flex items-center justify-center">
                                    <Badge
                                        variant="secondary"
                                        className="flex min-w-[120px] items-center gap-2 px-4 py-2 text-lg transition-colors"
                                        style={{ backgroundColor: data.bg_color, color: data.text_color }}
                                    >
                                        {data.short_name || 'Preview'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="note">Nota</Label>
                                <CustomTextarea
                                    id="note"
                                    autoComplete="off"
                                    tabIndex={3}
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value.slice(0, 200))}
                                    disabled={processing || isView}
                                    placeholder={!isView ? 'Horario, descuentos, etc.' : ''}
                                    maxLength={200}
                                />
                                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                                    <InputError message={errors.note} />
                                    <span aria-live="polite">{data.note.length}/200</span>
                                </div>
                            </div>

                            <div className="grid justify-start gap-2">
                                <Label htmlFor="enabled">Estado</Label>
                                <Switch
                                    id="enabled"
                                    tabIndex={5}
                                    checked={!!data.enabled}
                                    onCheckedChange={(value) => setData('enabled', value)}
                                    disabled={processing || !isEdit}
                                />
                                <Label htmlFor="enabled">{!data.enabled ? 'Desactivado' : 'Activado'}</Label>
                            </div>

                            {!isView && (
                                <Button type="submit" className="mx-auto mt-4 w-fit cursor-pointer" tabIndex={6}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Actualizando ' : 'Creando ') : isEdit ? 'Actualizar' : 'Crear'} Lugar
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
