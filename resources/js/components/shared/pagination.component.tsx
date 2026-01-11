import { Link } from '@inertiajs/react';

export function Pagination({ links }: { links: { url: string | null; label: string; active: boolean }[] }) {
    const firstLink = links[0];
    const lastLink = links[links.length - 1];

    const numberLinks = links.slice(1, -1).filter((link) => {
        const cleanLabel = link.label.replace(/&hellip;/g, '...').trim();
        return cleanLabel !== '...' && !isNaN(Number(cleanLabel));
    });

    let visibleLinks = numberLinks;
    if (numberLinks.length > 5) {
        const activeIndex = numberLinks.findIndex((link) => link.active);
        const totalPages = numberLinks.length;

        if (activeIndex <= 1) {
            const firstTwo = numberLinks.slice(0, 2);
            const lastTwo = numberLinks.slice(-2);
            const ellipsis = { url: null, label: '...', active: false };
            visibleLinks = [...firstTwo, ellipsis, ...lastTwo];
        } else if (activeIndex >= totalPages - 2) {
            const firstTwo = numberLinks.slice(0, 2);
            const lastTwo = numberLinks.slice(-2);
            const ellipsis = { url: null, label: '...', active: false };
            visibleLinks = [...firstTwo, ellipsis, ...lastTwo];
        } else {
            const firstPage = numberLinks.slice(0, 1);
            const middlePages = numberLinks.slice(activeIndex - 1, activeIndex + 2);
            const lastPage = numberLinks.slice(-1);
            const ellipsis1 = { url: null, label: '...', active: false };
            const ellipsis2 = { url: null, label: '...', active: false };
            visibleLinks = [...firstPage, ellipsis1, ...middlePages, ellipsis2, ...lastPage];
        }
    }

    const allLinks = [firstLink, ...visibleLinks, lastLink];

    return (
        <nav className="mt-4 flex w-full justify-center">
            <ul className="flex items-center gap-1">
                {allLinks.map((link, idx) => {
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
