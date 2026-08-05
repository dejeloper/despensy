import { useMemo, useState } from 'react';

/**
 * Category-filter state ('all' or a category id as string) plus the filtered
 * list, reused by every page that offers a "filter by category" select
 * (despensy, checkout pending/confirmed).
 */
export function useCategoryFilter<T>(items: T[], getCategoryId: (item: T) => number | string | null | undefined) {
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const filteredItems = useMemo(() => {
        if (categoryFilter === 'all') return items;

        return items.filter((item) => getCategoryId(item)?.toString() === categoryFilter);
    }, [items, categoryFilter, getCategoryId]);

    return { categoryFilter, setCategoryFilter, filteredItems };
}
