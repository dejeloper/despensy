import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Loading } from './loading.component';

export function GlobalLoading() {
    const [isLoading, setIsLoading] = useState(false);

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        type InertiaVisitDetail = {
            prefetch?: boolean;
            preload?: boolean;
            isPrefetch?: boolean;
            [key: string]: unknown;
        };

        type InertiaEvent = { detail?: { prefetch?: boolean; visit?: InertiaVisitDetail } } | undefined;

        const isPrefetchEvent = (e?: InertiaEvent) => {
            const detail = e?.detail;
            const visit = detail?.visit;

            return Boolean(detail?.prefetch || visit?.prefetch || visit?.preload || visit?.isPrefetch);
        };

        const handleStart = (e?: InertiaEvent) => {
            if (isPrefetchEvent(e)) return;

            if (window.__skipGlobalLoading) return;

            const force = Boolean(window.__forceGlobalLoading);

            window.requestAnimationFrame(() => setIsLoading(true));

            if (force) {
                try {
                    window.__forceGlobalLoading = false;
                } catch {
                    /* ignore */
                }
            }
        };

        const handleFinish = (e?: InertiaEvent) => {
            if (isPrefetchEvent(e)) return;

            try {
                window.__forceGlobalLoading = false;
            } catch {
                /* ignore */
            }

            window.requestAnimationFrame(() => setIsLoading(false));
        };

        router.on('start', handleStart);
        router.on('finish', handleFinish);

        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isLoading) {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                setIsLoading(false);
                timeoutRef.current = null;
            }, 30_000);
        } else {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    }, [isLoading]);

    return (
        <Dialog open={isLoading} onOpenChange={() => {}}>
            <DialogContent hideClose className="rounded-md border-none bg-background/90 p-4 sm:max-w-[220px]">
                <DialogTitle className="sr-only">Cargando</DialogTitle>
                <DialogDescription className="sr-only">Operación en progreso</DialogDescription>
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <Loading size="md" />
                    <p className="text-xs font-medium text-muted-foreground">Cargando...</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
