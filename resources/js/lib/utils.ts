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
 * Sort a list by its `name` field using Spanish collation, so accents sort
 * where they belong in the alphabet instead of after "z" (localeCompare
 * default/ASCII order).
 */
export function sortByName<T extends {name: string}>(items: T[]): T[] {
    return [...items].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
