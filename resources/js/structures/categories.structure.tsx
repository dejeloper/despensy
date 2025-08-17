import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/business/category';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export const categoryColumns: Column<Category>[] = [
    { key: 'name', label: 'Nombre' },
    {
        key: 'bg_color',
        label: 'Color de fondo',
        render: (cat) => (
            <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: cat.bg_color }} />
                {cat.bg_color}
            </div>
        ),
    },
    {
        key: 'text_color',
        label: 'Color de texto',
        render: (cat) => (
            <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: cat.text_color }} />
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
                    className="flex min-w-[120px] items-center gap-2 px-4 py-2"
                    style={{ backgroundColor: cat.bg_color, color: cat.text_color }}
                >
                    {cat.icon} {cat.name}
                </Badge>
            </div>
        ),
    },
];

export const categoryActions: Action<Category>[] = [
    {
        label: 'Ver',
        icon: <Eye className="mr-1 h-4 w-4" />,
        onClick: (cat) => router.visit(route('categories.show', cat.id)),
    },
    {
        label: 'Editar',
        icon: <Pencil className="mr-1 h-4 w-4" />,
        onClick: (cat) => router.visit(route('categories.edit', cat.id)),
    },
    {
        label: 'Eliminar',
        icon: <Trash2 className="mr-1 h-4 w-4" />,
        variant: 'destructive',
        onClick: (cat) => {
            if (confirm(`¿Seguro que deseas eliminar "${cat.name}"?`)) {
                router.delete(route('categories.destroy', cat.id));
            }
        },
    },
];
