import { DataCardsProps } from '@/types/ui';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function DataCards<T>({ data, columns, actions = [], emptyMessage = 'No hay registros', isLoading = false }: DataCardsProps<T>) {
    if (isLoading) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                                {columns.map((_, fieldIdx) => (
                                    <div key={fieldIdx} className="flex flex-col">
                                        <Skeleton className="mb-1 h-3 w-16" />
                                        <Skeleton className="mt-1 h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                            {actions.length > 0 && (
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

    return (
        <div className="w-full">
            {data.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                                {columns.map((col) => (
                                    <div key={col.label} className={`flex flex-col ${col.className ?? ''}`}>
                                        <span className="text-xs text-muted-foreground">{col.label}</span>
                                        <div className="mt-1 text-sm">
                                            {col.render ? (col.render as (i: T) => ReactNode)(item) : ((item[col.key as keyof T] ?? '') as ReactNode)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {actions.length > 0 && (
                                <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
                                    {actions.map((action, aidx) => {
                                        const labelEmptyClass = action.label ? 'mr-1 rounded-lg' : 'rounded-full';
                                        const btnClass = `${labelEmptyClass} ${action.className ?? ''}`.trim();

                                        return (
                                            <Button
                                                key={aidx}
                                                variant={action.variant ?? 'default'}
                                                size="sm"
                                                className={btnClass}
                                                style={action.style}
                                                title={action.title}
                                                onClick={() => action.onClick(item)}
                                            >
                                                {action.icon} {action.label ?? ''}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex h-24 items-center justify-center text-muted-foreground">{emptyMessage}</div>
            )}
        </div>
    );
}

export default DataCards;
