import { Badge } from '@/components/ui/badge';
import { Consumer } from '@/types/business/consumer';
import { Action, Column } from '@/types/ui';
import { router } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';

export const consumerColumns: Column<Consumer>[] = [
    { key: 'name', label: 'Nombre' },
    {
        key: 'type',
        label: 'Tipo',
        render: (consumer) => {
            return <Badge variant={consumer.type === 'human' ? 'default' : 'secondary'}>{consumer.type === 'human' ? 'Humano' : 'Mascota'}</Badge>;
        },
    },
];

export const consumerActions: Action<Consumer>[] = [
    {
        title: 'Editar Consumidor',
        icon: <Edit />,
        onClick: (c) => router.visit(route('consumers.edit', c.id)),
    },
    {
        title: 'Eliminar Consumidor',
        icon: <Trash />,
        variant: 'destructive',
        onClick: (c) => {
            if (confirm(`¿Seguro que deseas eliminar "${c.name}"?`)) {
                router.delete(route('consumers.destroy', c.id));
            }
        },
    },
];
