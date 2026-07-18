import { Toast, ToastType, useToast } from '@/contexts/toast-context';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const typeConfig: Record<ToastType, { bg: string; icon: typeof CheckCircle2; iconColor: string }> = {
    success: {
        bg: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
        icon: CheckCircle2,
        iconColor: 'text-green-500 dark:text-green-400',
    },
    error: {
        bg: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
        icon: XCircle,
        iconColor: 'text-red-500 dark:text-red-400',
    },
    warning: {
        bg: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500 dark:text-yellow-400',
    },
    info: {
        bg: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
        icon: Info,
        iconColor: 'text-blue-500 dark:text-blue-400',
    },
    neutral: {
        bg: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-950 dark:border-gray-700 dark:text-gray-200',
        icon: Info,
        iconColor: 'text-gray-400 dark:text-gray-500',
    },
};

function ToastItem({ toast }: { toast: Toast }) {
    const { dismiss } = useToast();
    const config = typeConfig[toast.type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                'pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right-full',
                config.bg,
            )}
        >
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.iconColor)} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const { toasts } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-end gap-2 px-4">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
