import { Trophy } from 'lucide-react';
import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface TopListCardProps<T extends { purchases_count: number }> {
    title: string;
    items: T[];
    getKey: (item: T) => string | number;
    renderItem: (item: T) => ReactNode;
    emptyMessage?: string;
}

export function TopListCard<T extends { purchases_count: number }>({
    title,
    items,
    getKey,
    renderItem,
    emptyMessage = 'Aún no hay compras registradas.',
}: TopListCardProps<T>) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">{title}</span>
                </div>

                {items.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                        {items.map((item, index) => (
                            <li key={getKey(item)} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                    {renderItem(item)}
                                </div>
                                <span className="text-sm font-semibold">{item.purchases_count} compra(s)</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    );
}
