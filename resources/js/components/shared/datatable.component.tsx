import { DataTableProps } from '@/types/ui';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DataTable<T>({ data, columns, actions = [], emptyMessage = 'No hay registros', isLoading = false }: DataTableProps<T>) {
    const totalCols = Math.max(1, columns.length + (actions.length > 0 ? 1 : 0));
    const colWidth = `${(100 / totalCols).toFixed(4)}%`;

    if (isLoading) {
        return (
            <div className="relative overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <Table className="w-full text-left text-sm">
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableHead key={index} className="cursor-default" style={{ width: colWidth }}>
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                            ))}
                            {actions.length > 0 && (
                                <TableHead className="text-center" style={{ width: colWidth }}>
                                    <Skeleton className="mx-auto h-4 w-20" />
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((_, colIndex) => (
                                    <TableCell key={colIndex} className="cursor-default" style={{ width: colWidth }}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                                {actions.length > 0 && (
                                    <TableCell style={{ width: colWidth }}>
                                        <div className="flex justify-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="relative overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <Table className="w-full text-left text-sm">
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.label} className={`cursor-default ${col.className ?? ''}`} style={{ width: colWidth }}>
                                {col.label}
                            </TableHead>
                        ))}
                        {actions.length > 0 && (
                            <TableHead className="text-center" style={{ width: colWidth }}>
                                Acciones
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <TableRow key={index}>
                                {columns.map((col) => (
                                    <TableCell key={col.label} className={`cursor-default ${col.className ?? ''}`} style={{ width: colWidth }}>
                                        {col.render ? col.render(item) : ((item[col.key as keyof T] ?? '') as ReactNode)}
                                    </TableCell>
                                ))}

                                {actions.length > 0 && (
                                    <TableCell style={{ width: colWidth }}>
                                        <div className="flex justify-center gap-2">
                                            {actions.map((action, idx) => {
                                                const labelEmptyClass = action.label ? 'mr-1 rounded-lg' : 'rounded-full';

                                                const btnClass = `${labelEmptyClass}   ${action.className ?? ''}`.trim();
                                                return (
                                                    <Button
                                                        key={idx}
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
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="h-24 cursor-default text-muted-foreground">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
