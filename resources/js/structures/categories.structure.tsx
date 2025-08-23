import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/business/category';
import { Edit, Eye, Trash } from 'lucide-react';

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
                <Badge
                    variant="secondary"
                    className="flex min-w-[120px] items-center gap-2 px-4 py-2 font-black"
                    style={{ backgroundColor: cat.bg_color!, color: cat.text_color! }}
                >
                    {cat.icon} {cat.name}
                </Badge>
            </div>
        ),
    },
];

export const categoryActions: Action<Category>[] = [
    {
        title: 'Ver Categoría',
        icon: <Eye />,
        onClick: (c) => router.visit(route('categories.show', c.id)),
    },
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
