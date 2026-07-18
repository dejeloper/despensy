import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Place } from '@/types/business/place';
import { Edit, Trash } from 'lucide-react';

export const placeColumns: Column<Place>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'address', label: 'Dirección' },
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
        render: (place) => (
            <div className="flex items-center">
                <ColorBadge text={place.name ?? ''} bgColor={place.bg_color} textColor={place.text_color} />
            </div>
        ),
    },
];

export const placeActions: Action<Place>[] = [
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
