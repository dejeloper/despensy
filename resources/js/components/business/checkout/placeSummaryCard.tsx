import { useMemo } from 'react';

import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Money } from '@/components/shared/money.component';

import { ChecklistItem } from '@/types/business/checklist';
import { Place } from '@/types/business/place';

interface PlaceSummaryRow {
    place: Place;
    productsCount: number;
    total: number;
}

interface PlaceSummaryCardProps {
    boughtItems: ChecklistItem[];
}

export function PlaceSummaryCard({ boughtItems }: PlaceSummaryCardProps) {
    const rows = useMemo<PlaceSummaryRow[]>(() => {
        const byPlaceId = new Map<number, PlaceSummaryRow>();

        for (const item of boughtItems) {
            if (!item.place || item.total_price == null) continue;

            const existing = byPlaceId.get(item.place.id!);
            if (existing) {
                existing.productsCount += 1;
                existing.total += item.total_price;
            } else {
                byPlaceId.set(item.place.id!, { place: item.place, productsCount: 1, total: item.total_price });
            }
        }

        return Array.from(byPlaceId.values()).sort((a, b) => b.total - a.total);
    }, [boughtItems]);

    if (rows.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-start gap-1 border-b p-3 text-sm">
            {rows.map(({ place, productsCount, total }) => (
                <div key={place.id} className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <ColorBadge text={place.name} bgColor={place.bg_color} textColor={place.text_color} className="min-w-0 shrink-0 px-2 py-0.5 text-xs" />
                    <span>
                        Productos: <span className="font-bold">{productsCount}</span> · Total: <Money value={total} className="font-bold" />
                    </span>
                </div>
            ))}
        </div>
    );
}
