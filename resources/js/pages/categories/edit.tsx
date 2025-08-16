import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

import { Category } from '@/types/business/category';

interface Props {
    category: Category;
}

export default function CategoryEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        icon: category.icon,
        bg_color: category.bg_color,
        text_color: category.text_color,
        enabled: category.enabled,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('categories.update', category.id));
    }

    return (
        <AppLayout>
            <Head title={`Editar Categoría: ${category.name}`} />
            <div className="mx-auto max-w-xl p-6">
                <h1 className="mb-4 text-2xl font-bold">Editar Categoría</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Nombre</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="block font-medium">Icono</label>
                        <input
                            type="text"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.icon && <div className="text-sm text-red-500">{errors.icon}</div>}
                    </div>
                    <div>
                        <label className="block font-medium">Color de fondo</label>
                        <input
                            type="text"
                            value={data.bg_color}
                            onChange={(e) => setData('bg_color', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.bg_color && <div className="text-sm text-red-500">{errors.bg_color}</div>}
                    </div>
                    <div>
                        <label className="block font-medium">Color de texto</label>
                        <input
                            type="text"
                            value={data.text_color}
                            onChange={(e) => setData('text_color', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.text_color && <div className="text-sm text-red-500">{errors.text_color}</div>}
                    </div>
                    <div>
                        <label className="block font-medium">Estado</label>
                        <select
                            value={data.enabled ? '1' : '0'}
                            onChange={(e) => setData('enabled', e.target.value === '1')}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Link href={route('categories.index')} className="text-gray-600 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
