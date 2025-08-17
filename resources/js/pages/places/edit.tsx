import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

import PlaceForm from '@/components/business/places/placeForm';
import { Place } from '@/types/business/place';

interface Props {
    place: Place;
}

export default function PlaceEdit({ place }: Props) {
    return (
        <AppLayout>
            <Head title={`Editar Lugar: ${place.name}`} />
            <PlaceForm place={place} isEdit={true} isView={false} />
        </AppLayout>
    );
}
