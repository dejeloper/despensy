import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Category } from '@/types/business/category';
import { Edit, Trash } from 'lucide-react';

export const categoryColumns: Column<Category>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'icon', label: 'Icono' },
    {
        key: 'bg_color',
        label: 'Color de fondo',
        render: (cat) => (
            <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: cat.bg_color! }} />
                {cat.bg_color}
            </div>
        ),
    },
    {
        key: 'text_color',
        label: 'Color de texto',
        render: (cat) => (
            <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: cat.text_color! }} />
                {cat.text_color}
            </div>
        ),
    },
    {
        key: 'preview',
        label: 'Vista previa',
        render: (cat) => (
            <div className="flex items-center">
                <ColorBadge text={cat.name} icon={cat.icon} bgColor={cat.bg_color} textColor={cat.text_color} />
            </div>
        ),
    },
];

export const categoryActions: Action<Category>[] = [
    {
        title: 'Editar Categoría',
        icon: <Edit />,
        onClick: (c) => router.visit(route('categories.edit', c.id)),
    },
    {
        title: 'Eliminar Categoría',
        icon: <Trash />,
        variant: 'destructive',
        onClick: (c) => {
            if (confirm(`¿Seguro que deseas eliminar "${c.name}"?`)) {
                router.delete(route('categories.destroy', c.id));
            }
        },
    },
];
