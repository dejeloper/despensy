import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { cn, formatCurrency } from '@/lib/utils';

type MoneyTrend = 'up' | 'down' | 'equal';

interface MoneyProps {
    value: number | string | null | undefined;
    currency?: string;
    trend?: MoneyTrend;
    showIcon?: boolean;
    emptyText?: string;
    className?: string;
}

const trendColorClasses: Record<MoneyTrend, string> = {
    up: 'text-green-600',
    down: 'text-red-600',
    equal: 'text-gray-500',
};

const trendIcons: Record<MoneyTrend, typeof TrendingUp> = {
    up: TrendingUp,
    down: TrendingDown,
    equal: Minus,
};

export function Money({ value, currency = '$', trend, showIcon = false, emptyText, className }: MoneyProps) {
    const formatted = formatCurrency(value, currency);

    if (!formatted) {
        return emptyText ? <span className={cn('text-gray-400', className)}>{emptyText}</span> : null;
    }

    const Icon = trend ? trendIcons[trend] : null;

    return (
        <span className={cn('inline-flex items-center gap-1 font-semibold', trend ? trendColorClasses[trend] : undefined, className)}>
            {showIcon && Icon && <Icon className="h-4 w-4" />}
            {formatted}
        </span>
    );
}
