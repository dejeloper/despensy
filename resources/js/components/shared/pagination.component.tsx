import { Link } from '@inertiajs/react';

export function Pagination({ links }: { links: { url: string | null; label: string; active: boolean }[] }) {
    return (
        <nav className="mt-4 flex w-full justify-center">
            <ul className="flex items-center gap-1">
                {links.map((link, idx) => {
                    const label = link.label
                        .replace(/&laquo;|&raquo;/g, '')
                        .replace('Previous', 'Anterior')
                        .replace('Next', 'Siguiente');

                    const isArrow = /Anterior|Siguiente|Previous|Next/i.test(label);
                    return (
                        <li key={idx}>
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md border px-2 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground shadow'
                                            : 'bg-background hover:bg-accent hover:text-accent-foreground'
                                    } ${isArrow ? 'w-auto px-3' : ''}`}
                                    aria-current={link.active ? 'page' : undefined}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <span
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md border px-2 py-1 text-sm font-medium text-muted-foreground ${isArrow ? 'w-auto px-3' : ''}`}
                                >
                                    {label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
