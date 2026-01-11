import { Skeleton } from '@/components/ui/skeleton';

interface DataCardsSkeletonProps {
    cards?: number;
    fields?: number;
    showActions?: boolean;
}

export function DataCardsSkeleton({ cards = 4, fields = 4, showActions = true }: DataCardsSkeletonProps) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                {Array.from({ length: cards }).map((_, idx) => (
                    <div key={idx} className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                            {Array.from({ length: fields }).map((_, fieldIdx) => (
                                <div key={fieldIdx} className="flex flex-col">
                                    <Skeleton className="mb-1 h-3 w-16" />
                                    <Skeleton className="mt-1 h-4 w-full" />
                                </div>
                            ))}
                        </div>

                        {showActions && (
                            <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DataCardsSkeleton;
