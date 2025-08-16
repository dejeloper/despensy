import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import InputError from '@/components/input-error';
import ButtonSearchEmojis from '@/components/shared/button-search-emojis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Categorías',
        href: '/dashboard/categories',
    },
    {
        title: 'Crear Categoría',
        href: '#',
    },
];

type CategoryCreateForm = {
    name: string;
    icon: string;
    bg_color: string;
    text_color: string;
};

export default function CategoryCreate() {
    const { data, setData, post, processing, errors } = useForm<Required<CategoryCreateForm>>({
        name: '',
        icon: '',
        bg_color: '#ffffff',
        text_color: '#000000',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Categoría" />
            <div className="flex h-full flex-1 flex-col items-center p-4">
                <div className="w-full max-w-2xl rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-md dark:border-sidebar-border dark:bg-sidebar">
                    <form method="POST" className="flex flex-col gap-8" onSubmit={submit}>
                        {/* Nombre */}
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

                        {/* Icono */}
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

                        {/* Colores + Preview */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
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
                            <div>
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

                            {/* Preview */}
                            <div className="flex justify-center">
                                <Badge
                                    variant="secondary"
                                    className="mt-2 flex min-w-[120px] items-center gap-2 px-4 py-2 text-lg transition-colors sm:mt-4"
                                    style={{ backgroundColor: data.bg_color, color: data.text_color }}
                                >
                                    <span>{data.icon}</span> {data.name || 'Preview'}
                                </Badge>
                            </div>
                        </div>

                        {/* Botón submit */}
                        <Button variant="default" type="submit" className="mt-2 w-full sm:w-auto sm:self-center" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Crear Categoría
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
