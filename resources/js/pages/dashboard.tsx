import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, ShoppingBasket } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
];

interface ActiveChecklist {
    id: number;
    name: string | null;
    state: { name: string; color: string | null };
    itemsCount: number;
}

interface DashboardProps {
    activeChecklist: ActiveChecklist | null;
}

function ChecklistSummaryCard({ activeChecklist }: { activeChecklist: ActiveChecklist | null }) {
    return (
        <Card className="relative aspect-video overflow-hidden">
            <CardContent className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ClipboardList className="h-4 w-4" />
                    <span className="text-sm font-medium">Lista de compra</span>
                </div>

                {activeChecklist ? (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">{activeChecklist.name || `Lista #${activeChecklist.id}`}</span>
                            <Badge style={{ backgroundColor: activeChecklist.state.color || undefined }}>{activeChecklist.state.name}</Badge>
                        </div>
                        <p className="text-3xl font-bold">
                            {activeChecklist.itemsCount} <span className="text-sm font-normal text-muted-foreground">producto(s)</span>
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No tienes una lista de compra abierta.</p>
                )}

                <Button asChild size="sm" variant="outline" className="w-fit">
                    <Link href={route('despensy.index')}>
                        <ShoppingBasket className="mr-1 h-4 w-4" /> Ir a Despensa
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ activeChecklist }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <ChecklistSummaryCard activeChecklist={activeChecklist} />
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
