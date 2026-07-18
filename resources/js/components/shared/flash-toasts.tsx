import { useToast } from '@/contexts/toast-context';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export function FlashToasts() {
    const { flash } = usePage<SharedData>().props;
    const { success, error, warning, info } = useToast();
    const prevFlash = useRef(flash);

    useEffect(() => {
        if (flash.success && flash.success !== prevFlash.current.success) success(flash.success);
        if (flash.error && flash.error !== prevFlash.current.error) error(flash.error);
        if (flash.warning && flash.warning !== prevFlash.current.warning) warning(flash.warning);
        if (flash.info && flash.info !== prevFlash.current.info) info(flash.info);

        prevFlash.current = flash;
    }, [flash, success, error, warning, info]);

    return null;
}
