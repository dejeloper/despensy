import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableSkeletonProps {
    rows?: number;
    columns?: number;
    showActions?: boolean;
}

export function DataTableSkeleton({ rows = 5, columns = 4, showActions = true }: DataTableSkeletonProps) {
    const totalCols = columns + (showActions ? 1 : 0);
    const colWidth = `${(100 / totalCols).toFixed(4)}%`;

    return (
        <div className="relative overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <Table className="w-full text-left text-sm">
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: columns }).map((_, index) => (
                            <TableHead key={index} className="cursor-default" style={{ width: colWidth }}>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                        ))}
                        {showActions && (
                            <TableHead className="text-center" style={{ width: colWidth }}>
                                <Skeleton className="mx-auto h-4 w-20" />
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <TableCell key={colIndex} className="cursor-default" style={{ width: colWidth }}>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}

                            {showActions && (
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
