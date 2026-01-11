import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
    onPageChange?: (page: number) => void;
}

export function Pagination({ links, onPageChange }: PaginationProps) {
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

    const handleClick = (e: React.MouseEvent, link: (typeof links)[0], pageNumber?: number) => {
        if (onPageChange && pageNumber) {
            e.preventDefault();
            onPageChange(pageNumber);
        }
    };

    return (
        <nav className="mt-4 flex w-full justify-center">
            <ul className="flex items-center gap-1">
                {allLinks.map((link, idx) => {
                    const label = link.label
                        .replace(/&laquo;|&raquo;/g, '')
                        .replace('Previous', 'Anterior')
                        .replace('Next', 'Siguiente');

                    const isArrow = /Anterior|Siguiente|Previous|Next/i.test(label);

                    // Determinar el número de página
                    let pageNumber: number | undefined;
                    if (!isArrow && !isNaN(Number(label))) {
                        pageNumber = Number(label);
                    } else if (label.includes('Anterior') || label.includes('Previous')) {
                        const activePage = allLinks.find((l) => l.active);
                        const activePageNum = activePage ? Number(activePage.label) : 1;
                        pageNumber = activePageNum - 1;
                    } else if (label.includes('Siguiente') || label.includes('Next')) {
                        const activePage = allLinks.find((l) => l.active);
                        const activePageNum = activePage ? Number(activePage.label) : 1;
                        pageNumber = activePageNum + 1;
                    }

                    return (
                        <li key={idx}>
                            {link.url ? (
                                onPageChange ? (
                                    <button
                                        onClick={(e) => handleClick(e, link, pageNumber)}
                                        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border px-2 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground shadow'
                                                : 'bg-background hover:bg-accent hover:text-accent-foreground'
                                        } ${isArrow ? 'w-auto px-3' : ''}`}
                                        aria-current={link.active ? 'page' : undefined}
                                    >
                                        {label}
                                    </button>
                                ) : (
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
                                )
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
