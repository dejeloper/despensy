import { Head } from '@inertiajs/react';
import ConsumerForm from '@/components/business/consumers/consumerForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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
        title: 'Crear Consumidor',
        href: '#',
    },
];

export default function ConsumerCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Consumidor" />
            <ConsumerForm consumer={undefined} isEdit={false} />
        </AppLayout>
    );
}
