import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Checklist } from '../types/business/checklist';
import { Badge } from '@/components/ui/badge';

export const checklistColumns: Column<Checklist>[] = [
    { key: 'id', label: 'ID' },
    {
        key: 'status',
        label: 'Estado',
        render: (checklist) => {
            return (
                <Badge variant={checklist.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {checklist.status === 'ACTIVE' ? 'Activo' : 'Completado'}
                </Badge>
            );
        },
    },
    {
        key: 'created_at',
        label: 'Fecha de Creación',
        render: (checklist) => new Date(checklist.created_at).toLocaleDateString('es-ES'),
    },
];

export const checklistActions: Action<Checklist>[] = [
    {
        title: 'Ver Checklist',
        icon: <Eye />,
        onClick: (c) => router.visit(route('checklists.show', c.id)),
    },
];
