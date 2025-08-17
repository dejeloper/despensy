import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import PlaceForm from '@/components/business/places/placeForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Lugares',
        href: '/dashboard/places',
    },
    {
        title: 'Crear Lugar',
        href: '#',
    },
];

export default function PlaceCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Lugar" />
            <PlaceForm place={{}} isEdit={false} isView={false} />
        </AppLayout>
    );
}
