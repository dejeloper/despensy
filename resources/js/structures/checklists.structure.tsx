import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';

import { CircleCheck, CirclePlay, CircleX, Eye, GitMerge } from 'lucide-react';
import { Checklist } from '../types/business/checklist';

import { Badge } from '@/components/ui/badge';

export const checklistColumns: Column<Checklist>[] = [
    {
        key: 'id',
        label: 'Número',
        render: (checklist) => <span className="font-medium">#{checklist.id}</span>,
    },
    {
        key: 'updated_at',
        label: 'Última actualización',
    },
    {
        key: 'state',
        label: 'Estado',
        render: (checklist) => {
            return checklist.state ? (
                <div className="flex items-center justify-center">
                    <Badge style={{ backgroundColor: checklist.state.color || undefined }}>{checklist.state.name}</Badge>
                </div>
            ) : (
                <div className="text-center text-gray-400">Sin estado</div>
            );
        },
    },
    {
        key: 'items_count',
        label: 'Items',
        render: (checklist) => (
            <div className="text-center">
                <Badge variant="outline">{checklist.items_count ?? 0}</Badge>
            </div>
        ),
    },
    {
        key: 'user',
        label: 'Usuario',
        render: (checklist) => checklist.user?.name ?? 'Sin usuario',
    },
];

export const checklistActions: Action<Checklist>[] = [
    {
        title: 'Ver lista',
        icon: <Eye />,
        variant: 'ghost',
        onClick: (checklist) => router.visit(route('checklists.show', checklist.id)),
    },
    {
        title: 'Abrir lista',
        icon: <CirclePlay />,
        onClick: () => {},
    },
    {
        title: 'Cerrar lista',
        icon: <CircleCheck />,
        onClick: () => {},
    },
    {
        title: 'Cancelar lista',
        icon: <CircleX />,
        variant: 'destructive',
        onClick: () => {},
    },
    {
        title: 'Combinar lista',
        icon: <GitMerge />,
        variant: 'ghost',
        onClick: () => {},
    },
];
