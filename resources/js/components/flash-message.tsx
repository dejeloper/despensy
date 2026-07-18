import { Alert, AlertDescription } from '@/components/ui/alert';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FlashMessage() {
    const { flash } = usePage<SharedData>().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!flash.success && !flash.error) return;

        setVisible(true);
        const timeout = setTimeout(() => setVisible(false), 4000);

        return () => clearTimeout(timeout);
    }, [flash.success, flash.error]);

    if (!visible || (!flash.success && !flash.error)) return null;

    return (
        <div className="px-4 pt-4">
            <Alert variant={flash.error ? 'destructive' : 'default'}>
                {flash.error ? <XCircle /> : <CheckCircle2 />}
                <AlertDescription>{flash.error || flash.success}</AlertDescription>
            </Alert>
        </div>
    );
}
