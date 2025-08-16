import { Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import ButtonSearchEmojis from '@/components/shared/button-search-emojis';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { ArrowLeft, LoaderCircle } from 'lucide-react';

type CategoryForm = {
    name: string;
    icon: string;
    bg_color: string;
    text_color: string;
    enabled: boolean | null;
    _method: 'POST' | 'PUT';
};

export default function CategoryForm({ ...props }) {
    const { category, isView, isEdit } = props;

    const { data, setData, post, processing, reset, errors } = useForm<Required<CategoryForm>>({
        name: category.name || '',
        icon: category.icon || '',
        bg_color: category.bg_color || '#ffffff',
        text_color: '#000000',
        enabled: isEdit || isView ? category.enabled : true,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route('categories.update', category.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="grid gap-0 sm:grid-cols-2 sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight xl:text-4xl">
                        {isView ? 'Ver' : isEdit ? 'Actualizar' : 'Crear'} Categoría
                    </h1>

                    <Button asChild size={'sm'} title="Volver a Categorías">
                        <Link href={route('categories.index')} className="text-muted-foreground hover:text-foreground sm:hidden">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-self-end">
                    <Button variant="ghost" size="sm" className="hidden px-2 text-sm text-muted-foreground hover:text-foreground sm:flex" asChild>
                        <Link href={route('categories.index')}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Categorías
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent>
                    <form onSubmit={submit} className="mx-auto flex w-3/5 flex-col gap-4" autoComplete="off">
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
                                    disabled={processing}
                                    placeholder="Lácteos"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="icon">Icono</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="icon"
                                        type="text"
                                        required
                                        maxLength={1}
                                        autoComplete="off"
                                        tabIndex={2}
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                        disabled={processing}
                                        readOnly
                                        placeholder="🍎"
                                    />
                                    <ButtonSearchEmojis onSelect={(emoji) => setData('icon', emoji)} />
                                </div>
                                <InputError message={errors.icon} className="mt-1" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="bg_color">Background</Label>
                                    <Input
                                        id="bg_color"
                                        type="color"
                                        autoComplete="off"
                                        tabIndex={3}
                                        value={data.bg_color}
                                        onChange={(e) => setData('bg_color', e.target.value)}
                                        disabled={processing}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="text_color">Texto</Label>
                                    <Input
                                        id="text_color"
                                        type="color"
                                        autoComplete="off"
                                        tabIndex={4}
                                        value={data.text_color}
                                        onChange={(e) => setData('text_color', e.target.value)}
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex justify-center">
                                    <Badge
                                        variant="secondary"
                                        className="mt-2 flex min-w-[120px] items-center gap-2 px-4 py-2 text-lg transition-colors sm:mt-4"
                                        style={{ backgroundColor: data.bg_color, color: data.text_color }}
                                    >
                                        <span>{data.icon}</span> {data.name || 'Preview'}
                                    </Badge>
                                </div>
                                <div className="grid gap-2">
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
                            </div>

                            {!isView && (
                                <Button type="submit" className="mx-auto mt-4 w-fit cursor-pointer" tabIndex={6}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Actualizando ' : 'Creando ') : isEdit ? 'Actualizar' : 'Crear'} Categoría
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
