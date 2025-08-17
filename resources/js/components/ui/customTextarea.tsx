import { cn } from "@/lib/utils";
import * as React from "react";
import { Textarea } from "@headlessui/react";

type CustomTextareaProps = React.ComponentProps<"textarea"> & {
    /** If true (default) the component will use responsive rows when `rows` is not provided */
    responsive?: boolean;
};

export const CustomTextarea = ({ className, responsive = true, rows, ...props }: CustomTextareaProps) => {
    const [internalRows, setInternalRows] = React.useState<number | undefined>(rows);

    React.useEffect(() => {
        if (rows !== undefined) {
            // user provided rows explicitly -> don't override
            setInternalRows(rows);
            return;
        }

        if (!responsive) {
            setInternalRows(undefined);
            return;
        }

        function updateRows() {
            if (typeof window === 'undefined') return;
            const isSmall = window.matchMedia('(max-width: 640px)').matches; // tailwind sm breakpoint
            setInternalRows(isSmall ? 6 : 3);
        }

        updateRows();
        window.addEventListener('resize', updateRows);
        return () => window.removeEventListener('resize', updateRows);
    }, [rows, responsive]);

    return (
        <Textarea
            data-slot="textarea"
            rows={internalRows}
            className={cn(
                "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                "resize-none",
                className
            )}
            {...props}
        />
    );
}