import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
 * Precio por unidad base ("$1,49", "$100", "$100,5"). A diferencia de
 * `formatCurrency`, que trunca a entero porque los precios de compra son pesos
 * redondos, aquí los decimales son el dato: el gramo puede costar menos de un
 * peso. Sin ceros de relleno: $100,00 se muestra "$100".
 */
export function formatUnitPrice(value: number | string | null | undefined, symbol: string = '$'): string {
    const formatted = formatQuantity(value);

    return formatted === '' ? '' : `${symbol}${formatted}`;
}

/**
 * Número legible ("1.640", "1,64", "100,5"): hasta 2 decimales **truncados**
 * —nunca redondeados hacia arriba— y sin ceros de relleno.
 */
export function formatQuantity(value: number | string | null | undefined): string {
    const numeric = toNumber(value);
    if (numeric === null) return '';

    const truncated = Math.trunc(numeric * 100) / 100;

    return truncated.toLocaleString('es-CO', { maximumFractionDigits: 2 });
}

function toNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;

    const numeric = typeof value === 'string' ? parseFloat(value) : value;

    return Number.isNaN(numeric) ? null : numeric;
}

/**
 * Lowercase + strip diacritics (á → a, ñ → n, ...) so search matches
 * regardless of accents on either side (buscar "cafe" encuentra "café" y
 * viceversa).
 */
export function normalizeText(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Turn a decimal typed with the Spanish separator ("1,64") into the form the
 * backend expects ("1.64"). Deja intacto lo que ya viene con punto o sin
 * decimales, y devuelve '' para vacío.
 */
export function normalizeDecimal(value: string): string {
    return value.trim().replace(',', '.');
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
