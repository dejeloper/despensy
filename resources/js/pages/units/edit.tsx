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
        title: 'Editar Unidad',
        href: '#',
    },
];

export default function UnitEdit({ unit }: { unit: Unit }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${unit.name}`} />
            <UnitForm unit={unit} isEdit={true} isView={false} />
        </AppLayout>
    );
}
