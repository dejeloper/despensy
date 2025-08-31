import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { Unit } from '@/types/business/unit';
import { Edit, Trash } from 'lucide-react';

export const unitColumns: Column<Unit>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'short_name', label: 'Nombre corto' },
];

export const unitActions: Action<Unit>[] = [
    {
        title: 'Editar Unidad',
        icon: <Edit />,
        onClick: (u) => router.visit(route('units.edit', u.id)),
    },
    {
        title: 'Eliminar Unidad',
        variant: 'destructive',
        icon: <Trash />,
        onClick: (c) => {
            if (confirm(`¿Seguro que deseas eliminar "${c.name}"?`)) {
                router.delete(route('units.destroy', c.id));
            }
        },
    },
];
