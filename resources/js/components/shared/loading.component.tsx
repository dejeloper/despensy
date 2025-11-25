import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
};

export function Loading({ size = 'md', className, text }: LoadingProps) {
    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            <LoaderCircle className={cn('animate-spin text-primary', sizeClasses[size])} />
            {text && <span className="text-sm text-muted-foreground">{text}</span>}
        </div>
    );
}
