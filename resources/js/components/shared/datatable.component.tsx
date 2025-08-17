import { DataTableProps } from '@/types/ui';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DataTable<T>({ data, columns, actions = [], emptyMessage = 'No hay registros' }: DataTableProps<T>) {
    return (
        <div className="relative overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <Table className="w-full text-left text-sm">
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.label} className={`text-center ${col.className ?? ''}`}>
                                {col.label}
                            </TableHead>
                        ))}
                        {actions.length > 0 && <TableHead className="text-right">Acciones</TableHead>}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <TableRow key={index}>
                                {columns.map((col) => (
                                    <TableCell key={col.label} className={col.className}>
                                        {col.render ? col.render(item) : ((item[col.key as keyof T] ?? '') as ReactNode)}
                                    </TableCell>
                                ))}

                                {actions.length > 0 && (
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            {actions.map((action, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant={action.variant ?? 'default'}
                                                    size="sm"
                                                    onClick={() => action.onClick(item)}
                                                >
                                                    {action.icon} {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="h-24 text-center text-muted-foreground">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
