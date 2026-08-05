import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a money value as "$16.961" — no decimals, truncated (never rounded
 * up), with "." as the thousands separator.
 */
export function formatCurrency(value: number | string | null | undefined, symbol: string = '$'): string {
    if (value === null || value === undefined || value === '') return '';

    const numeric = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(numeric)) return '';

    return `${symbol}${Math.trunc(numeric).toLocaleString('es-CO')}`;
}

/**
 * Lowercase + strip diacritics (á → a, ñ → n, ...) so search matches
 * regardless of accents on either side (buscar "cafe" encuentra "café" y
 * viceversa).
 */
export function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

/**
 * Column to sort by: either a key of T, or an accessor for nested/derived
 * values (e.g. `(item) => item.product?.name`).
 */
export type SortKey<T> = keyof T | ((item: T) => string | number | null | undefined);

/**
 * Generic sort usable by any listing in the app. Strings are compared with
 * Spanish collation (`localeCompare('es')`) so accents sort where they
 * belong in the alphabet instead of after "z"; numbers sort numerically.
 * Null/undefined values are pushed to the end regardless of direction.
 */
export function sortBy<T>(items: T[], key: SortKey<T>, direction: 'asc' | 'desc' = 'asc'): T[] {
    const selector = typeof key === 'function' ? key : (item: T) => item[key] as unknown as string | number | null | undefined;
    const factor = direction === 'asc' ? 1 : -1;

    return [...items].sort((a, b) => {
        const aVal = selector(a);
        const bVal = selector(b);

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return factor * aVal.localeCompare(bVal, 'es');
        }

        return factor * ((aVal as number) - (bVal as number));
    });
}
