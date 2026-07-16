import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ColorBadgeProps {
    text: string;
    icon?: string | null;
    bgColor?: string | null;
    textColor?: string | null;
    className?: string;
}

export function ColorBadge({ text, icon, bgColor, textColor, className }: ColorBadgeProps) {
    return (
        <Badge
            className={cn('flex min-w-30 items-center gap-2 px-4 py-2 font-black', className)}
            style={{
                backgroundColor: bgColor || undefined,
                color: textColor || undefined,
            }}
        >
            {icon} {text}
        </Badge>
    );
}
