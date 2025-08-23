import { Head } from '@inertiajs/react';

import UnitForm from '@/components/business/units/unitForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Unidades',
        href: '/dashboard/units',
    },
    {
        title: 'Crear Unidad',
        href: '#',
    },
];

export default function UnitCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Unidad" />
            <UnitForm unit={undefined} isEdit={false} isView={false} />
        </AppLayout>
    );
}
