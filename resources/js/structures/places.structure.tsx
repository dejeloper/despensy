import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Place } from '@/types/business/place';
import { Edit, Eye, Trash } from 'lucide-react';

export const placeColumns: Column<Place>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'address', label: 'Dirección' },
    {
        key: 'bg_color',
        label: 'Color de fondo',
        render: (cat) => (
            <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: cat.bg_color! }} />
                {cat.bg_color}
            </div>
        ),
    },
    {
        key: 'text_color',
        label: 'Color de texto',
        render: (cat) => (
            <div className="flex items-center justify-center gap-2">
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
                    className="flex min-w-[120px] items-center gap-2 px-4 py-2"
                    style={{ backgroundColor: cat.bg_color!, color: cat.text_color! }}
                >
                    {cat.short_name}
                </Badge>
            </div>
        ),
    },
];

export const placeActions: Action<Place>[] = [
    {
        title: 'Ver Lugar',
        icon: <Eye />,
        onClick: (p) => router.visit(route('places.show', p.id)),
    },
    {
        title: 'Editar Lugar',
        icon: <Edit />,
        onClick: (p) => router.visit(route('places.edit', p.id)),
    },
    {
        title: 'Eliminar Lugar',
        icon: <Trash />,
        variant: 'destructive',
        onClick: (p) => {
            if (confirm(`¿Seguro que deseas eliminar "${p.name}"?`)) {
                router.delete(route('places.destroy', p.id));
            }
        },
    },
];
