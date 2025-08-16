import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import InputError from '@/components/input-error';
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <form method="POST" className="flex flex-col gap-6 p-5" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Lacteos"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="icon">Icono</Label>
                                <Input
                                    id="icon"
                                    type="text"
                                    required
                                    maxLength={1}
                                    tabIndex={2}
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    disabled={processing}
                                    placeholder="icono"
                                />
                                <InputError message={errors.icon} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <div>
                                    <Label htmlFor="bg_color">Background Color</Label>
                                    <Input
                                        id="bg_color"
                                        type="color"
                                        required
                                        tabIndex={3}
                                        value={data.bg_color}
                                        onChange={(e) => setData('bg_color', e.target.value)}
                                        disabled={processing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="text_color">Text Color</Label>
                                    <Input
                                        id="text_color"
                                        type="color"
                                        required
                                        tabIndex={4}
                                        value={data.text_color}
                                        onChange={(e) => setData('text_color', e.target.value)}
                                        disabled={processing}
                                    />
                                </div>
                                <div
                                    className="mt-4 w-full rounded-lg border p-2 text-center font-semibold sm:col-span-2 sm:mx-auto sm:w-1/2 md:col-span-1 md:w-3/4"
                                    style={{
                                        backgroundColor: data.bg_color,
                                        color: data.text_color,
                                        borderColor: data.text_color,
                                    }}
                                >
                                    {data.icon} {data.name}
                                </div>
                            </div>

                            <Button variant={'default'} type="submit" className="mx-auto mt-2" tabIndex={5} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Crear Categoría
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
