import { Badge } from '@/components/ui/badge';
import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Checklist } from '../types/business/checklist';

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
        title: 'Editar Checklist',
        icon: <Edit />,
        onClick: (c) => {
            try {
                (window as any).__forceGlobalLoading = true;
            } catch (e) {
                /* ignore */
            }
            router.visit(route('checklists.edit', c.id));
        },
    },
    {
        title: 'Hacer confirmación',
        icon: <CheckCircle />,
        onClick: (c) => {
            try {
                (window as any).__forceGlobalLoading = true;
            } catch (e) {
                /* ignore */
            }
            router.visit(route('checklists.show', c.id));
        },
    },
    {
        title: 'Eliminar checklist',
        icon: <Trash2 />,
        onClick: (c) => {
            if (confirm('¿Estás seguro de que deseas eliminar este checklist?')) {
                try {
                    (window as any).__forceGlobalLoading = true;
                } catch (e) {
                    /* ignore */
                }
                router.delete(route('checklists.destroy', c.id));
            }
        },
        variant: 'destructive',
    },
];
