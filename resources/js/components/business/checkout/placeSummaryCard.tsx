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

            const price = Number(item.total_price);
            const existing = byPlaceId.get(item.place.id!);
            if (existing) {
                existing.productsCount += 1;
                existing.total += price;
            } else {
                byPlaceId.set(item.place.id!, { place: item.place, productsCount: 1, total: price });
            }
        }

        return Array.from(byPlaceId.values()).sort((a, b) => b.total - a.total);
    }, [boughtItems]);

    if (rows.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 gap-3 border-b p-3 pb-6 sm:grid-cols-3 lg:grid-cols-6">
            {rows.map(({ place, productsCount, total }) => (
                <div key={place.id} className="flex flex-col items-start gap-2 rounded-lg border p-3">
                    <ColorBadge text={place.name} bgColor={place.bg_color} textColor={place.text_color} />
                    <div className="text-base text-muted-foreground">
                        <p>
                            Productos: <span className="font-bold text-foreground">{productsCount}</span>
                        </p>
                        <p>
                            Total: <Money value={total} className="font-bold" />
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
