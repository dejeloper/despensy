import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Loading } from './loading.component';

export function GlobalLoading() {
    const [isLoading, setIsLoading] = useState(false);

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // Only show the global loading for real visits, not for prefetches
        type InertiaVisitDetail = {
            prefetch?: boolean;
            preload?: boolean;
            isPrefetch?: boolean;
            [key: string]: unknown;
        };

        type InertiaEvent = { detail?: { prefetch?: boolean; visit?: InertiaVisitDetail } } | undefined;

        const isPrefetchEvent = (e?: InertiaEvent) => {
            // Defensive checks for different Inertia versions / event payload shapes
            const detail = e?.detail;
            const visit = detail?.visit;

            return Boolean(detail?.prefetch || visit?.prefetch || visit?.preload || visit?.isPrefetch);
        };

        const handleStart = (e?: InertiaEvent) => {
            if (isPrefetchEvent(e)) return;

            // Do not show for visits that requested to skip global loading
            if ((window as any).__skipGlobalLoading) return;

            // If someone explicitly requested the global loading to force-show, honor it
            const force = Boolean((window as any).__forceGlobalLoading);

            // show the modal immediately for real visits
            window.requestAnimationFrame(() => setIsLoading(true));

            // if forced, clear the flag after showing (finish handler will also clear on finish)
            if (force) {
                try {
                    (window as any).__forceGlobalLoading = false;
                } catch (e) {
                    /* ignore */
                }
            }
        };

        const handleFinish = (e?: InertiaEvent) => {
            if (isPrefetchEvent(e)) return;

            // Ensure any force flag is cleared
            try {
                (window as any).__forceGlobalLoading = false;
            } catch (err) {
                /* ignore */
            }

            // hide the modal in next rAF to batch with other DOM work
            window.requestAnimationFrame(() => setIsLoading(false));
        };

        router.on('start', handleStart);
        router.on('finish', handleFinish);

        return () => {
            // router.off is not available in this project setup,
            // so we avoid calling it to prevent runtime errors.
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Auto-close after 30 seconds maximum to avoid stuck modal
    useEffect(() => {
        if (isLoading) {
            // clear any previous timeout
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            // set max 30s timeout
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
        <Dialog
            open={isLoading}
            onOpenChange={() => {
                /* prevent user from closing */
            }}
        >
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
