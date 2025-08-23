import { Head } from '@inertiajs/react';

import UnitForm from '@/components/business/units/unitForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Unit } from '@/types/business/unit';

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
        title: 'Ver Unidad',
        href: '#',
    },
];

export default function UnitShow({ unit }: { unit: Unit }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={unit.name} />
            <UnitForm unit={unit} isEdit={false} isView={true} />
        </AppLayout>
    );
}
