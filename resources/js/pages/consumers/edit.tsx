import { Head } from '@inertiajs/react';

import ConsumerForm from '@/components/business/consumers/consumerForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Consumer } from '@/types/business/consumer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Consumidores',
        href: '/dashboard/consumers',
    },
    {
        title: 'Editar Consumidor',
        href: '#',
    },
];

export default function ConsumerEdit({ consumer }: { consumer: Consumer }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${consumer.name}`} />
            <ConsumerForm consumer={consumer} isEdit={true} />
        </AppLayout>
    );
}
