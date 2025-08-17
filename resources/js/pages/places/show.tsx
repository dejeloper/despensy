import PlaceForm from '@/components/business/places/placeForm';
import AppLayout from '@/layouts/app-layout';
import { Place } from '@/types/business/place';
import { Head } from '@inertiajs/react';

interface PlaceProps {
    place: Place;
}

export default function PlaceShow({ place }: PlaceProps) {
    return (
        <AppLayout>
            <Head title={`Lugar: ${place.name}`} />
            <PlaceForm place={place} isEdit={false} isView={true} />
        </AppLayout>
    );
}
